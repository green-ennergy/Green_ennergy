<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\MissionTrace;
use App\Models\Operator;
use App\Models\Project;
use App\Support\MissionTypeData;
use App\Support\ServiceRequestMissionSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MissionController extends Controller
{
    private const TYPES = ['installation', 'maintenance', 'delivery', 'study'];

    private const STATUSES = ['assigned', 'in_progress', 'on_hold', 'completed'];

    private const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

    public function index(Request $request): JsonResponse
    {
        $query = Mission::with(['operator.user', 'project', 'traces'])
            ->orderByDesc('scheduled_date')
            ->orderByDesc('id');

        if ($request->user()?->role === 'operator') {
            $operatorId = $request->user()->operator?->id_operator;
            $query->where('id_operator', $operatorId ?? 0);
            ServiceRequestMissionSync::backfillMissing();
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($operatorId = $request->query('operator_id')) {
            $query->where('id_operator', $operatorId);
        }

        return response()->json([
            'data' => $query->get()->map(fn (Mission $mission) => $this->present($mission))->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateMission($request);
        $this->assertNoScheduleConflict(
            (int) $validated['operatorId'],
            $validated['scheduledDate'],
            $validated['timeSlot']
        );

        $mission = DB::transaction(function () use ($validated, $request) {
            $operator = Operator::with('user')->findOrFail($validated['operatorId']);
            $typeData = MissionTypeData::forType(
                $validated['type'],
                is_array($validated['typeData'] ?? null) ? $validated['typeData'] : []
            );

            $mission = Mission::create([
                'code' => $this->nextCode($validated['type']),
                'type' => $validated['type'],
                'title' => $validated['title'],
                'status' => 'assigned',
                'priority' => $validated['priority'] ?? 'medium',
                'scheduled_date' => $validated['scheduledDate'],
                'time_slot' => $validated['timeSlot'],
                'client_name' => $validated['clientName'],
                'client_phone' => $validated['clientPhone'] ?? null,
                'client_email' => $validated['clientEmail'] ?? null,
                'client_address' => $validated['clientAddress'] ?? null,
                'client_city' => $validated['clientCity'] ?? null,
                'admin_notes' => $validated['adminNotes'] ?? null,
                'operator_notes' => null,
                'type_data' => $typeData,
                'id_operator' => $operator->id_operator,
                'id_project' => $validated['projectId'] ?? null,
            ]);

            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Created and assigned to '.$operator->user?->name);

            return $mission;
        });

        $mission->load(['operator.user', 'project', 'traces']);

        return response()->json([
            'mission' => $this->present($mission),
        ], 201);
    }

    public function update(Request $request, Mission $mission): JsonResponse
    {
        if ($request->user()?->role === 'operator') {
            return $this->updateOwn($request, $mission);
        }

        $validated = $this->validateMission($request, partial: true);
        $operatorChanged = false;
        $operatorName = $mission->operator?->user?->name;

        $nextOperatorId = isset($validated['operatorId'])
            ? (int) $validated['operatorId']
            : (int) $mission->id_operator;
        $nextDate = $validated['scheduledDate'] ?? optional($mission->scheduled_date)->toDateString();
        $nextSlot = $validated['timeSlot'] ?? $mission->time_slot;
        $nextStatus = $validated['status'] ?? $mission->status;

        if ($nextStatus !== 'completed') {
            $this->assertNoScheduleConflict($nextOperatorId, $nextDate, $nextSlot, $mission->id);
        }

        if (isset($validated['operatorId']) && (int) $validated['operatorId'] !== (int) $mission->id_operator) {
            $operator = Operator::with('user')->findOrFail($validated['operatorId']);
            $mission->id_operator = $operator->id_operator;
            $operatorChanged = true;
            $operatorName = $operator->user?->name;
        }

        if (array_key_exists('projectId', $validated)) {
            $mission->id_project = $validated['projectId'];
        }

        $this->fillMission($mission, $validated);
        $mission->save();

        if ($operatorChanged) {
            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Reassigned to '.$operatorName);
        } else {
            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Mission details updated');
        }

        $mission->load(['operator.user', 'project', 'traces']);

        return response()->json([
            'mission' => $this->present($mission),
        ]);
    }

    public function updateOwn(Request $request, Mission $mission): JsonResponse
    {
        $operator = $request->user()->operator;
        abort_unless($operator && (int) $mission->id_operator === (int) $operator->id_operator, 403);

        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(self::STATUSES)],
            'operatorNotes' => ['nullable', 'string'],
            'typeData' => ['nullable', 'array'],
            'traceAction' => ['nullable', 'string', 'max:500'],
        ]);

        if (isset($validated['status'])) {
            $mission->status = $validated['status'];
        }
        if (array_key_exists('operatorNotes', $validated)) {
            $mission->operator_notes = $validated['operatorNotes'];
        }
        if (isset($validated['typeData']) && is_array($validated['typeData'])) {
            $mission->type_data = MissionTypeData::forType(
                $mission->type,
                array_replace_recursive(
                    is_array($mission->type_data) ? $mission->type_data : [],
                    $validated['typeData']
                )
            );
        }
        $mission->save();

        $actor = $request->user()->name;
        $action = $validated['traceAction']
            ?? (isset($validated['status'])
                ? 'Status updated to '.str_replace('_', ' ', strtoupper($validated['status']))
                : 'Field notes updated');
        $this->trace($mission, $actor, $action);

        ServiceRequestMissionSync::syncServiceRequestFromMission($mission);

        $mission->load(['operator.user', 'project', 'traces']);

        return response()->json([
            'mission' => $this->present($mission),
        ]);
    }

    public function destroy(Mission $mission): JsonResponse
    {
        $mission->delete();

        return response()->json(['message' => 'Mission deleted.']);
    }

    private function validateMission(Request $request, bool $partial = false): array
    {
        $request->merge([
            'clientEmail' => $request->input('clientEmail') ?: null,
            'clientPhone' => $request->input('clientPhone') ?: null,
            'projectId' => $request->input('projectId') ?: null,
        ]);
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'type' => [$required, Rule::in(self::TYPES)],
            'title' => [$required, 'string', 'max:255'],
            'operatorId' => [$required, 'integer', 'exists:operators,id_operator'],
            'projectId' => ['nullable', 'integer', 'exists:projects,id_project'],
            'priority' => ['nullable', Rule::in(self::PRIORITIES)],
            'scheduledDate' => [$required, 'date', 'after_or_equal:today'],
            'timeSlot' => [$required, 'string', 'max:32'],
            'clientName' => [$required, 'string', 'max:255'],
            'clientPhone' => ['nullable', 'string', 'max:50'],
            'clientEmail' => ['nullable', 'email', 'max:255'],
            'clientAddress' => ['nullable', 'string', 'max:255'],
            'clientCity' => ['nullable', 'string', 'max:100'],
            'adminNotes' => ['nullable', 'string'],
            'typeData' => ['nullable', 'array'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);
    }

    private function fillMission(Mission $mission, array $validated): void
    {
        $map = [
            'type' => 'type',
            'title' => 'title',
            'priority' => 'priority',
            'scheduledDate' => 'scheduled_date',
            'timeSlot' => 'time_slot',
            'clientName' => 'client_name',
            'clientPhone' => 'client_phone',
            'clientEmail' => 'client_email',
            'clientAddress' => 'client_address',
            'clientCity' => 'client_city',
            'adminNotes' => 'admin_notes',
            'status' => 'status',
            'typeData' => 'type_data',
        ];

        foreach ($map as $input => $column) {
            if (array_key_exists($input, $validated)) {
                if ($input === 'typeData') {
                    $type = $validated['type'] ?? $mission->type;
                    $mission->type_data = MissionTypeData::forType(
                        $type,
                        is_array($validated['typeData']) ? $validated['typeData'] : []
                    );

                    continue;
                }
                $mission->{$column} = $validated[$input];
            }
        }
    }

    private function assertNoScheduleConflict(
        int $operatorId,
        string $scheduledDate,
        string $timeSlot,
        ?int $excludeMissionId = null
    ): void {
        $incoming = $this->parseTimeSlot($timeSlot);
        if (! $incoming) {
            throw ValidationException::withMessages([
                'timeSlot' => ['Invalid time slot format.'],
            ]);
        }

        $query = Mission::query()
            ->where('id_operator', $operatorId)
            ->whereDate('scheduled_date', $scheduledDate)
            ->where('status', '!=', 'completed');

        if ($excludeMissionId) {
            $query->where('id', '!=', $excludeMissionId);
        }

        foreach ($query->get(['id', 'title', 'time_slot']) as $existing) {
            $other = $this->parseTimeSlot($existing->time_slot);
            if (! $other) {
                continue;
            }
            if ($incoming['start'] < $other['end'] && $other['start'] < $incoming['end']) {
                throw ValidationException::withMessages([
                    'timeSlot' => [
                        'This operator already has a task at this time: '.$existing->title.' ('.$existing->time_slot.').',
                    ],
                ]);
            }
        }
    }

    /**
     * @return array{start:int,end:int}|null
     */
    private function parseTimeSlot(string $slot): ?array
    {
        $normalized = preg_replace('/[–—]/u', '-', $slot) ?? $slot;
        if (! preg_match('/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/', $normalized, $m)) {
            return null;
        }

        $start = ((int) $m[1]) * 60 + (int) $m[2];
        $end = ((int) $m[3]) * 60 + (int) $m[4];

        return $end > $start ? ['start' => $start, 'end' => $end] : null;
    }

    private function nextCode(string $type): string
    {
        $prefix = 'TSK-'.strtoupper(substr($type, 0, 4));

        do {
            $code = $prefix.'-'.random_int(100, 999);
        } while (Mission::where('code', $code)->exists());

        return $code;
    }

    private function trace(Mission $mission, string $actor, string $action): void
    {
        MissionTrace::create([
            'id_mission' => $mission->id,
            'actor' => $actor,
            'action' => $action,
            'created_at' => now(),
        ]);
    }

    private function present(Mission $mission): array
    {
        $project = $mission->relationLoaded('project')
            ? $mission->project
            : ($mission->id_project ? Project::find($mission->id_project) : null);

        return [
            'id' => $mission->id,
            'code' => $mission->code,
            'type' => $mission->type,
            'title' => $mission->title,
            'operatorId' => $mission->id_operator,
            'operatorName' => $mission->operator?->user?->name ?? 'Unassigned',
            'projectId' => $mission->id_project,
            'projectName' => $project?->name,
            'serviceRequestId' => $mission->id_service_request,
            'serviceRequestNumber' => is_array($mission->type_data)
                ? ($mission->type_data['serviceRequestNumber'] ?? null)
                : null,
            'status' => $mission->status,
            'priority' => $mission->priority,
            'scheduledDate' => optional($mission->scheduled_date)->toDateString(),
            'timeSlot' => $mission->time_slot,
            'client' => [
                'name' => $mission->client_name,
                'phone' => $mission->client_phone,
                'email' => $mission->client_email,
                'address' => $mission->client_address,
                'city' => $mission->client_city,
            ],
            'adminNotes' => $mission->admin_notes,
            'operatorNotes' => $mission->operator_notes,
            'typeData' => MissionTypeData::forType(
                $mission->type,
                is_array($mission->type_data) ? $mission->type_data : []
            ),
            'traces' => $mission->traces->map(fn (MissionTrace $trace) => [
                'date' => optional($trace->created_at)->format('Y-m-d H:i'),
                'user' => $trace->actor,
                'action' => $trace->action,
            ])->values(),
        ];
    }
}
