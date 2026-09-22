<?php

namespace App\Support;

use App\Models\Mission;
use App\Models\MissionTrace;
use App\Models\Operator;
use App\Models\ServiceRequest;
use Illuminate\Support\Facades\DB;

class ServiceRequestMissionSync
{
    /**
     * Create or refresh the field mission when admin accepts & assigns an operator.
     */
    public static function syncFromAssignment(ServiceRequest $row, Operator $operator, string $actor = 'Admin'): Mission
    {
        $row->loadMissing('service');

        return DB::transaction(function () use ($row, $operator, $actor) {
            $type = self::resolveType($row);
            $scheduledDate = optional($row->preferred_date)?->toDateString() ?: now()->toDateString();
            $title = ($row->service?->title ?: 'Service request').' — '.$row->client_name;
            $adminNotes = trim(implode("\n", array_filter([
                $row->notes,
                'Service request: '.$row->number,
            ])));

            $typeData = MissionTypeData::forType($type, [
                'serviceRequestNumber' => $row->number,
                'serviceRequestId' => $row->id_service_request,
                'serviceTitle' => $row->service?->title,
                'reportedFault' => $row->notes ?: ($row->service?->title ?: 'Client service request'),
            ]);

            $mission = Mission::query()
                ->where('id_service_request', $row->id_service_request)
                ->first();

            if ($mission) {
                $mission->fill([
                    'type' => $type,
                    'title' => $title,
                    'status' => $mission->status === 'completed' ? 'completed' : 'assigned',
                    'scheduled_date' => $scheduledDate,
                    'client_name' => $row->client_name,
                    'client_phone' => $row->client_phone,
                    'client_email' => $row->client_email,
                    'client_address' => $row->address,
                    'client_city' => $row->city,
                    'admin_notes' => $adminNotes,
                    'type_data' => $typeData,
                    'id_operator' => $operator->id_operator,
                ]);
                $mission->save();
                self::trace($mission, $actor, 'Reassigned from service request '.$row->number.' to '.($operator->user?->name ?: 'operator'));
            } else {
                $mission = Mission::create([
                    'code' => self::nextCode($type),
                    'type' => $type,
                    'title' => $title,
                    'status' => 'assigned',
                    'priority' => 'medium',
                    'scheduled_date' => $scheduledDate,
                    'time_slot' => '09:00 - 12:00',
                    'client_name' => $row->client_name,
                    'client_phone' => $row->client_phone,
                    'client_email' => $row->client_email,
                    'client_address' => $row->address,
                    'client_city' => $row->city,
                    'admin_notes' => $adminNotes,
                    'operator_notes' => null,
                    'type_data' => $typeData,
                    'id_operator' => $operator->id_operator,
                    'id_service_request' => $row->id_service_request,
                ]);
                self::trace($mission, $actor, 'Created from service request '.$row->number.' and assigned to '.($operator->user?->name ?: 'operator'));
            }

            return $mission->fresh(['operator.user', 'traces']);
        });
    }

    /**
     * Keep the linked service request in sync when the operator updates the mission.
     */
    public static function syncServiceRequestFromMission(Mission $mission): void
    {
        if (! $mission->id_service_request) {
            return;
        }

        $row = ServiceRequest::find($mission->id_service_request);
        if (! $row) {
            return;
        }

        $history = $row->history ?? [];

        if ($mission->status === 'completed') {
            $row->status = 'completed';
            $row->current_phase = 5;
            $history[] = [
                'date' => now()->format('Y-m-d H:i'),
                'actor' => 'System',
                'text' => 'Service request completed via field mission '.$mission->code.'.',
            ];
        } elseif ($mission->status === 'in_progress') {
            $row->status = 'in_progress';
            $row->current_phase = max((int) $row->current_phase, 4);
            $history[] = [
                'date' => now()->format('Y-m-d H:i'),
                'actor' => 'System',
                'text' => 'Field mission '.$mission->code.' marked in progress.',
            ];
        } elseif ($mission->status === 'on_hold') {
            $history[] = [
                'date' => now()->format('Y-m-d H:i'),
                'actor' => 'System',
                'text' => 'Field mission '.$mission->code.' put on hold.',
            ];
        } elseif ($mission->status === 'assigned') {
            $row->status = $row->status === 'pending' ? 'accepted' : $row->status;
            $row->current_phase = max((int) $row->current_phase, 3);
        }

        $row->history = $history;
        $row->save();
    }

    /**
     * Create missions for accepted/assigned service requests that are still missing one.
     */
    public static function backfillMissing(): int
    {
        $created = 0;
        ServiceRequest::query()
            ->with(['service', 'operator.user'])
            ->whereNotNull('id_operator')
            ->where('status', '!=', 'rejected')
            ->whereDoesntHave('mission')
            ->each(function (ServiceRequest $row) use (&$created) {
                if (! $row->operator) {
                    return;
                }
                $mission = self::syncFromAssignment($row, $row->operator, 'System');
                if ($row->status === 'completed' && $mission->status !== 'completed') {
                    $mission->status = 'completed';
                    $mission->save();
                } elseif (in_array($row->status, ['in_progress'], true) && $mission->status === 'assigned') {
                    $mission->status = 'in_progress';
                    $mission->save();
                }
                $created++;
            });

        return $created;
    }

    public static function resolveType(ServiceRequest $row): string
    {
        $haystack = strtolower(trim(($row->service?->slug ?? '').' '.($row->service?->title ?? '')));

        if (str_contains($haystack, 'install') || str_contains($haystack, 'instal')) {
            return 'installation';
        }
        if (str_contains($haystack, 'deliver') || str_contains($haystack, 'livr')) {
            return 'delivery';
        }
        if (str_contains($haystack, 'study') || str_contains($haystack, 'audit') || str_contains($haystack, 'etude') || str_contains($haystack, 'étude')) {
            return 'study';
        }

        return 'maintenance';
    }

    private static function nextCode(string $type): string
    {
        $prefix = 'TSK-'.strtoupper(substr($type, 0, 4));
        do {
            $code = $prefix.'-'.random_int(100, 999);
        } while (Mission::where('code', $code)->exists());

        return $code;
    }

    private static function trace(Mission $mission, string $actor, string $action): void
    {
        MissionTrace::create([
            'id_mission' => $mission->id,
            'actor' => $actor,
            'action' => $action,
            'created_at' => now(),
        ]);
    }
}
