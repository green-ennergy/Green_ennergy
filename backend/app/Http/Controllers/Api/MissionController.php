<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\MissionTrace;
use App\Models\Operator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MissionController extends Controller
{
    private const TYPES = ['installation', 'maintenance', 'delivery', 'study'];

    private const STATUSES = ['assigned', 'in_progress', 'on_hold', 'completed'];

    private const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

    public function index(Request $request): JsonResponse
    {
        $query = Mission::with(['operator.user', 'traces'])->orderByDesc('scheduled_date')->orderByDesc('id');

        if ($request->user()?->role === 'operator') {
            $operatorId = $request->user()->operator?->id_operator;
            $query->where('id_operator', $operatorId ?? 0);
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

        $mission = DB::transaction(function () use ($validated, $request) {
            $operator = Operator::with('user')->findOrFail($validated['operatorId']);

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
                'type_data' => $validated['typeData'] ?? [],
                'id_operator' => $operator->id_operator,
            ]);

            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Created and assigned to '.$operator->user?->name);

            return $mission;
        });

        $mission->load(['operator.user', 'traces']);

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

        if (isset($validated['operatorId']) && (int) $validated['operatorId'] !== (int) $mission->id_operator) {
            $operator = Operator::with('user')->findOrFail($validated['operatorId']);
            $mission->id_operator = $operator->id_operator;
            $operatorChanged = true;
            $operatorName = $operator->user?->name;
        }

        $this->fillMission($mission, $validated);
        $mission->save();

        if ($operatorChanged) {
            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Reassigned to '.$operatorName);
        } else {
            $this->trace($mission, $request->user()?->name ?: 'Admin', 'Mission details updated');
        }

        $mission->load(['operator.user', 'traces']);

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
        if (isset($validated['typeData'])) {
            $mission->type_data = $validated['typeData'];
        }
        $mission->save();

        $actor = $request->user()->name;
        $action = $validated['traceAction']
            ?? (isset($validated['status'])
                ? 'Status updated to '.str_replace('_', ' ', strtoupper($validated['status']))
                : 'Field notes updated');
        $this->trace($mission, $actor, $action);

        $mission->load(['operator.user', 'traces']);

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
        ]);
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'type' => [$required, Rule::in(self::TYPES)],
            'title' => [$required, 'string', 'max:255'],
            'operatorId' => [$required, 'integer', 'exists:operators,id_operator'],
            'priority' => ['nullable', Rule::in(self::PRIORITIES)],
            'scheduledDate' => [$required, 'date'],
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
                $mission->{$column} = $validated[$input];
            }
        }
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
        return [
            'id' => $mission->id,
            'code' => $mission->code,
            'type' => $mission->type,
            'title' => $mission->title,
            'operatorId' => $mission->id_operator,
            'operatorName' => $mission->operator?->user?->name ?? 'Unassigned',
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
            'typeData' => $mission->type_data ?? [],
            'traces' => $mission->traces->map(fn (MissionTrace $trace) => [
                'date' => optional($trace->created_at)->format('Y-m-d H:i'),
                'user' => $trace->actor,
                'action' => $trace->action,
            ])->values(),
        ];
    }
}
