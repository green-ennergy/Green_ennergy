<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operator;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Support\ServiceRequestMissionSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ServiceRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = ServiceRequest::query()
            ->with(['service', 'operator.user', 'client.user'])
            ->orderByDesc('creation_date');

        if ($user->isAdministrator()) {
            // all
        } elseif ($user->isOperator()) {
            $operatorId = $user->operator?->id_operator;
            if (! $operatorId) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
            $query->where('id_operator', $operatorId);
        } elseif ($user->isClient()) {
            $clientId = $user->client?->id_client;
            $query->where(function ($q) use ($clientId, $user) {
                if ($clientId) {
                    $q->where('id_client', $clientId)
                        ->orWhere('client_email', $user->email);
                } else {
                    $q->where('client_email', $user->email);
                }
            });
        } else {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $rows = $query->get()->map(fn (ServiceRequest $row) => $this->present($row));

        return response()->json(['data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user?->isClient()) {
            return response()->json([
                'message' => 'Only clients can submit service requests.',
            ], 403);
        }

        $validated = $request->validate([
            'service_id' => ['required'],
            'clientName' => ['required', 'string', 'max:255'],
            'clientEmail' => ['required', 'email:filter', 'max:255'],
            'clientPhone' => ['required', 'string', 'max:50'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'preferredDate' => ['required', 'date'],
        ]);

        // Always bind identity to the authenticated client account
        $validated['clientName'] = $user->name;
        $validated['clientEmail'] = $user->email;
        $validated['clientPhone'] = $user->phone ?: $validated['clientPhone'];

        $serviceId = $validated['service_id'];
        $service = Service::query()
            ->where('enabled', true)
            ->where(function ($q) use ($serviceId) {
                $q->where('slug', $serviceId);

                if (is_numeric($serviceId) && (string) (int) $serviceId === (string) $serviceId) {
                    $q->orWhere('id_service', (int) $serviceId);
                }
            })
            ->first();

        if (! $service) {
            throw ValidationException::withMessages([
                'service_id' => ['Service not found or disabled.'],
            ]);
        }

        $history = [[
            'date' => now()->format('Y-m-d H:i'),
            'actor' => 'Client',
            'text' => 'Service request created and sent to dispatch.',
        ]];

        $row = ServiceRequest::create([
            'number' => $this->nextNumber(),
            'id_service' => $service->id_service,
            'id_client' => $user?->client?->id_client,
            'client_name' => $validated['clientName'],
            'client_email' => $validated['clientEmail'],
            'client_phone' => $validated['clientPhone'] ?? null,
            'city' => $validated['city'] ?? null,
            'address' => $validated['address'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'preferred_date' => $validated['preferredDate'] ?? null,
            'status' => 'pending',
            'current_phase' => 1,
            'history' => $history,
            'creation_date' => now(),
        ]);

        return response()->json([
            'request' => $this->present($row->load(['service', 'operator.user'])),
            'message' => 'Service request submitted',
        ], 201);
    }

    public function update(Request $request, string $serviceRequest): JsonResponse
    {
        $row = $this->resolveRequest($serviceRequest);

        $user = $request->user();

        if ($user->isAdministrator()) {
            return $this->adminUpdate($request, $row);
        }

        if ($user->isOperator()) {
            return $this->operatorUpdatePhase($request, $row);
        }

        return response()->json(['message' => 'Unauthorized.'], 403);
    }

    private function resolveRequest(string $serviceRequest): ServiceRequest
    {
        return ServiceRequest::query()
            ->where(function ($query) use ($serviceRequest) {
                $query->where('number', $serviceRequest);

                if (ctype_digit($serviceRequest)) {
                    $query->orWhere('id_service_request', (int) $serviceRequest);
                }
            })
            ->firstOrFail();
    }

    private function adminUpdate(Request $request, ServiceRequest $row): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', Rule::in(['pending', 'accepted', 'in_progress', 'completed', 'rejected'])],
            'current_phase' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'id_operator' => ['sometimes', 'nullable', 'integer', 'exists:operators,id_operator'],
            'operator_id' => ['sometimes', 'nullable'],
            'notes' => ['nullable', 'string'],
        ]);

        $history = $row->history ?? [];
        $operatorId = $validated['id_operator']
            ?? (isset($validated['operator_id']) ? (int) $validated['operator_id'] : null);

        if ($operatorId !== null) {
            $operatorId = (int) $operatorId;
        }

        if (array_key_exists('id_operator', $validated) || array_key_exists('operator_id', $validated)) {
            if ($operatorId) {
                $operator = Operator::with('user')->find($operatorId);
                $row->id_operator = $operatorId;
                $row->status = $validated['status'] ?? 'accepted';
                $row->current_phase = max((int) $row->current_phase, 3);
                $history[] = [
                    'date' => now()->format('Y-m-d H:i'),
                    'actor' => 'Admin',
                    'text' => 'Request accepted and assigned to '.($operator?->user?->name ?? 'operator').'.',
                ];
                $row->history = $history;
                $row->save();

                if ($operator) {
                    ServiceRequestMissionSync::syncFromAssignment($row->fresh(['service']), $operator, 'Admin');
                }

                return response()->json([
                    'request' => $this->present($row->fresh(['service', 'operator.user'])),
                    'message' => 'Service request updated',
                ]);
            } else {
                $row->id_operator = null;
            }
        }

        if (isset($validated['status'])) {
            $row->status = $validated['status'];
            if ($validated['status'] === 'rejected') {
                $history[] = [
                    'date' => now()->format('Y-m-d H:i'),
                    'actor' => 'Admin',
                    'text' => 'Service request rejected. '.($validated['notes'] ?? ''),
                ];
            }
        }

        if (isset($validated['current_phase'])) {
            $row->current_phase = (int) $validated['current_phase'];
            if ($row->current_phase === 5) {
                $row->status = 'completed';
            }
            $stepTitle = $this->phaseTitle($row, $row->current_phase);
            $history[] = [
                'date' => now()->format('Y-m-d H:i'),
                'actor' => 'Admin',
                'text' => 'Realization phase updated to '.$row->current_phase.' ('.$stepTitle.'). '.($validated['notes'] ?? ''),
            ];
        }

        $row->history = $history;
        $row->save();

        // If an operator is already linked, ensure a field mission exists
        if ($row->id_operator && $row->status !== 'rejected') {
            $operator = Operator::with('user')->find($row->id_operator);
            if ($operator && ! $row->mission()->exists()) {
                ServiceRequestMissionSync::syncFromAssignment($row->fresh(['service']), $operator, 'Admin');
            }
        }

        return response()->json([
            'request' => $this->present($row->fresh(['service', 'operator.user'])),
            'message' => 'Service request updated',
        ]);
    }

    private function operatorUpdatePhase(Request $request, ServiceRequest $row): JsonResponse
    {
        $operatorId = $request->user()->operator?->id_operator;
        if ((int) $row->id_operator !== (int) $operatorId) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'current_phase' => ['required', 'integer', 'min:1', 'max:5'],
            'notes' => ['nullable', 'string'],
        ]);

        $phase = (int) $validated['current_phase'];
        $row->current_phase = $phase;
        $row->status = $phase === 5 ? 'completed' : ($phase >= 2 ? 'in_progress' : $row->status);

        $history = $row->history ?? [];
        $history[] = [
            'date' => now()->format('Y-m-d H:i'),
            'actor' => 'Operator ('.$request->user()->name.')',
            'text' => 'Realization phase updated to '.$phase.' ('.$this->phaseTitle($row, $phase).'). '.($validated['notes'] ?? ''),
        ];
        $row->history = $history;
        $row->save();

        return response()->json([
            'request' => $this->present($row->fresh(['service', 'operator.user'])),
            'message' => 'Phase updated',
        ]);
    }

    private function present(ServiceRequest $row): array
    {
        $row->loadMissing(['service', 'operator.user']);

        return [
            'id' => $row->number,
            'id_service_request' => $row->id_service_request,
            'number' => $row->number,
            'serviceId' => $row->service?->slug,
            'service_id' => $row->id_service,
            'serviceTitle' => $row->service?->title,
            'clientName' => $row->client_name,
            'clientEmail' => $row->client_email,
            'clientPhone' => $row->client_phone,
            'city' => $row->city,
            'address' => $row->address,
            'notes' => $row->notes,
            'preferredDate' => optional($row->preferred_date)?->toDateString(),
            'status' => $row->status,
            'currentPhase' => (int) $row->current_phase,
            'currentPhaseTitle' => $this->phaseTitle($row, (int) $row->current_phase),
            'realizationSteps' => $row->service?->realization_steps ?? [
                ['step' => 1, 'key' => 'received', 'title' => 'Request logged', 'desc' => 'Service request received by dispatch.'],
                ['step' => 2, 'key' => 'review', 'title' => 'Review & planning', 'desc' => 'Technical assessment and planning.'],
                ['step' => 3, 'key' => 'assigned', 'title' => 'Operator assigned', 'desc' => 'Field technician assigned.'],
                ['step' => 4, 'key' => 'in_progress', 'title' => 'In progress', 'desc' => 'On-site work underway.'],
                ['step' => 5, 'key' => 'completed', 'title' => 'Completed', 'desc' => 'Service completed and handed over.'],
            ],
            'assignedOperatorId' => $row->id_operator,
            'assignedOperatorName' => $row->operator?->user?->name ?? 'Pending Assignment',
            'createdAt' => optional($row->creation_date)?->format('Y-m-d H:i'),
            'history' => $row->history ?? [],
        ];
    }

    private function phaseTitle(ServiceRequest $row, int $phase): string
    {
        $row->loadMissing('service');
        $steps = $row->service?->realization_steps ?? [];
        foreach ($steps as $step) {
            if ((int) ($step['step'] ?? 0) === $phase) {
                return (string) ($step['title'] ?? "Phase $phase");
            }
        }

        return "Phase $phase";
    }

    private function nextNumber(): string
    {
        do {
            $number = 'SRV-'.now()->format('Y').'-'.Str::upper(Str::random(4));
        } while (ServiceRequest::where('number', $number)->exists());

        return $number;
    }
}
