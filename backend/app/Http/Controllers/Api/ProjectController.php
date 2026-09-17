<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Installation;
use App\Models\Maintenance;
use App\Models\Project;
use App\Models\ProjectMessage;
use App\Models\ProjectTrace;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    private const PHASES = ['premier_contact', 'data_collection', 'energy_data', 'completed'];

    public function index(Request $request): JsonResponse
    {
        $query = $this->scopedQuery($request)->with([
            'client.user',
            'quoteRequests.products',
            'latestMessage.user',
            'installations',
            'maintenances',
        ]);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $projects = $query->orderByDesc('id_project')->get()
            ->map(fn (Project $project) => $this->present($project));

        return response()->json(['data' => $projects]);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);
        $project->load(['client.user', 'quoteRequests.products', 'installations', 'maintenances']);

        return response()->json($this->present($project));
    }

    public function quotes(): JsonResponse
    {
        $quotes = QuoteRequest::query()
            ->where(function ($query) {
                $query->whereNull('origin')->orWhere('origin', '!=', 'manual');
            })
            ->orderByDesc('creation_date')
            ->get()
            ->map(fn (QuoteRequest $quote) => [
                'id' => $quote->id_quote,
                'ticket_number' => $quote->number,
                'company' => $quote->company,
                'email' => $quote->email,
                'amount' => $quote->amount,
                'status' => $quote->status,
                'id_client' => $quote->id_client,
                'id_project' => $quote->id_project,
            ]);

        return response()->json(['data' => $quotes]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'id_client' => ['required', 'integer', 'exists:clients,id_client'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'quote_ids' => ['nullable', 'array'],
            'quote_ids.*' => ['integer', 'exists:quote_requests,id_quote'],
            ...$this->serviceRules(),
        ]);

        $quoteIds = $validated['quote_ids'] ?? [];
        $lines = $validated['lines'] ?? [];
        $installations = $validated['installations'] ?? [];
        $maintenances = $validated['maintenances'] ?? [];
        unset($validated['quote_ids'], $validated['lines'], $validated['installations'], $validated['maintenances']);

        $project = Project::create([
            ...$validated,
            'status' => 'premier_contact',
            'progress' => 25,
            'completed_steps' => ['premier_contact'],
            'start_date' => now()->toDateString(),
        ]);

        $attached = $this->syncQuotes($project, $quoteIds);
        $this->syncManualLines($project, $request, $lines);
        $this->syncInstallations($project, $installations);
        $this->syncMaintenances($project, $maintenances);

        $this->recordTrace($project, $request, 'Project opened', [[
            'label' => 'Phase',
            'action' => 'added',
            'to' => 'premier_contact',
        ]]);

        $project->load(['client.user', 'quoteRequests.products', 'latestMessage.user', 'installations', 'maintenances']);

        return response()->json([
            'project' => $this->present($project),
            'attached' => $attached,
        ], 201);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'admin_notes' => ['nullable', 'string'],
            'completed_steps' => ['sometimes', 'array'],
            'completed_steps.*' => ['string', Rule::in(self::PHASES)],
            'on_hold' => ['sometimes', 'boolean'],
            'quote_ids' => ['sometimes', 'array'],
            'quote_ids.*' => ['integer', 'exists:quote_requests,id_quote'],
            ...$this->serviceRules(),
        ]);

        $changes = [];

        if (array_key_exists('location', $validated) && $validated['location'] !== $project->location) {
            $changes[] = $this->change('Location', $project->location, $validated['location']);
            $project->location = $validated['location'];
        }

        if (array_key_exists('description', $validated)) {
            $incoming = $validated['description'];
            $keepOrderSummary = $incoming === null
                && preg_match('/^Confirmed order:/i', (string) $project->description);

            if (! $keepOrderSummary && $incoming !== $project->description) {
                $changes[] = $this->change('Client message', $project->description, $incoming);
                $project->description = $incoming;
            }
        }

        if (array_key_exists('admin_notes', $validated) && $validated['admin_notes'] !== $project->admin_notes) {
            $changes[] = $this->change('Internal notes', $project->admin_notes, $validated['admin_notes']);
            $project->admin_notes = $validated['admin_notes'];
        }

        $steps = $validated['completed_steps'] ?? $project->completed_steps ?? [];
        $steps = array_values(array_intersect(self::PHASES, $steps));
        if ($steps === []) {
            $steps = ['premier_contact'];
        }

        $onHold = array_key_exists('on_hold', $validated)
            ? $request->boolean('on_hold')
            : $project->status === 'on_hold';

        $nextStatus = $onHold ? 'on_hold' : $steps[array_key_last($steps)];
        $nextProgress = (int) round((count($steps) / count(self::PHASES)) * 100);

        if ($nextStatus !== $project->status) {
            $changes[] = $this->change('Status', $project->status, $nextStatus);
        }

        $project->completed_steps = $steps;
        $project->status = $nextStatus;
        $project->progress = $nextProgress;
        if ($nextStatus === 'completed' && ! $project->end_date) {
            $project->end_date = now()->toDateString();
        }
        $project->save();

        if (array_key_exists('quote_ids', $validated)) {
            $this->syncQuotes($project, $validated['quote_ids'] ?? []);
        }

        if (array_key_exists('lines', $validated)) {
            $this->syncManualLines($project, $request, $validated['lines'] ?? []);
        }

        if (array_key_exists('installations', $validated)) {
            $this->syncInstallations($project, $validated['installations'] ?? []);
        }

        if (array_key_exists('maintenances', $validated)) {
            $this->syncMaintenances($project, $validated['maintenances'] ?? []);
        }

        if ($changes !== []) {
            $this->recordTrace($project, $request, 'Follow-up updated', $changes);
        }

        $project->load(['client.user', 'quoteRequests.products', 'traces.user', 'installations', 'maintenances']);

        return response()->json([
            'project' => $this->present($project),
            'traces' => $project->traces->map(fn (ProjectTrace $trace) => $this->presentTrace($trace))->values(),
        ]);
    }

    public function traces(Project $project): JsonResponse
    {
        $project->load(['traces.user']);

        return response()->json([
            'traces' => $project->traces->map(fn (ProjectTrace $trace) => $this->presentTrace($trace))->values(),
        ]);
    }

    public function messages(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);
        $this->seedLegacyMessage($project);
        $project->load(['messages.user']);

        return response()->json([
            'messages' => $project->messages->map(fn (ProjectMessage $message) => $this->presentMessage($message))->values(),
        ]);
    }

    public function storeMessage(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $message = ProjectMessage::create([
            'id_project' => $project->id_project,
            'id_user' => $user?->id_user,
            'author' => $user?->role === 'client' ? 'client' : 'team',
            'body' => trim($validated['body']),
            'created_at' => now(),
        ]);
        $message->load('user');

        return response()->json([
            'message' => $this->presentMessage($message),
        ], 201);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }

    private function scopedQuery(Request $request)
    {
        $query = Project::query();
        $user = $request->user();

        if ($user?->role === 'client') {
            $clientId = $user->client?->id_client;
            $query->where('id_client', $clientId ?? 0);
        }

        return $query;
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        $user = $request->user();
        if ($user?->role === 'client' && $user->client?->id_client !== $project->id_client) {
            abort(404);
        }
    }

    private function recordTrace(Project $project, Request $request, string $summary, array $changes): void
    {
        ProjectTrace::create([
            'id_project' => $project->id_project,
            'id_user' => $request->user()?->id_user,
            'summary' => $summary,
            'changes' => $changes,
            'created_at' => now(),
        ]);
    }

    private function change(string $label, mixed $from, mixed $to): array
    {
        return [
            'label' => $label,
            'from' => $from ?: null,
            'to' => $to ?: null,
        ];
    }

    private function present(Project $project): array
    {
        $user = $project->client?->user;
        $allQuotes = $project->quoteRequests
            ? $project->quoteRequests->sortByDesc('creation_date')->values()
            : collect();
        $manual = $allQuotes->first(fn (QuoteRequest $quote) => $quote->origin === 'manual');
        $quotes = $allQuotes->reject(fn (QuoteRequest $quote) => $quote->origin === 'manual')->values();

        return [
            'id' => $project->id_project,
            'id_client' => $project->id_client,
            'name' => $project->name,
            'type' => $project->type,
            'location' => $project->location,
            'status' => $project->status,
            'progress' => $project->progress,
            'completed_steps' => $project->completed_steps ?? [],
            'description' => $project->description,
            'admin_notes' => $project->admin_notes,
            'start_date' => optional($project->start_date)->toDateString(),
            'end_date' => optional($project->end_date)->toDateString(),
            'user' => $user ? [
                'id' => $user->id_user,
                'name' => $user->name,
                'company' => $user->company,
                'email' => $user->email,
                'phone' => $user->phone,
            ] : null,
            'lines' => $this->presentLines($manual),
            'installations' => $project->installations
                ->map(fn (Installation $row) => $this->presentInstallation($row))
                ->values(),
            'maintenances' => $project->maintenances
                ->map(fn (Maintenance $row) => $this->presentMaintenance($row))
                ->values(),
            'rfq_tickets' => $quotes->map(fn (QuoteRequest $quote) => $this->presentQuote($quote))->values(),
            'rfq_ticket' => $quotes->isNotEmpty() ? $this->presentQuote($quotes->first()) : null,
            'latest_message' => $project->latestMessage
                ? $this->presentMessage($project->latestMessage)
                : null,
        ];
    }

    private function presentQuote(QuoteRequest $quote): array
    {
        return [
            'id' => $quote->id_quote,
            'ticket_number' => $quote->number,
            'quoted_total' => $quote->amount,
            'status' => $quote->status,
            'items' => $quote->products->map(function ($product) {
                $quantity = (int) $product->pivot->quantity;
                $unitPrice = (float) $product->pivot->unit_price;

                return [
                    'id' => $product->id_product,
                    'display_name' => $product->pivot->label ?: $product->title,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $unitPrice * $quantity,
                ];
            })->values(),
        ];
    }

    private function syncQuotes(Project $project, array $quoteIds): int
    {
        $ids = array_values(array_unique(array_map('intval', $quoteIds)));

        QuoteRequest::where('id_project', $project->id_project)
            ->where(function ($query) {
                $query->whereNull('origin')->orWhere('origin', '!=', 'manual');
            })
            ->when($ids !== [], fn ($query) => $query->whereNotIn('id_quote', $ids))
            ->update(['id_project' => null]);

        if ($ids === []) {
            return 0;
        }

        return QuoteRequest::whereIn('id_quote', $ids)
            ->where('id_client', $project->id_client)
            ->where(function ($query) {
                $query->whereNull('origin')->orWhere('origin', '!=', 'manual');
            })
            ->update(['id_project' => $project->id_project]);
    }

    private function serviceRules(): array
    {
        return [
            'lines' => ['nullable', 'array'],
            'lines.*.id_product' => ['required', 'integer', 'exists:products,id_product'],
            'lines.*.quantity' => ['required', 'integer', 'min:1', 'max:32767'],
            'lines.*.unit_price' => ['required', 'numeric', 'min:0'],
            'lines.*.title' => ['nullable', 'string', 'max:50'],
            'installations' => ['nullable', 'array'],
            'installations.*.id' => ['nullable', 'integer'],
            'installations.*.name' => ['nullable', 'string', 'max:255'],
            'installations.*.location' => ['nullable', 'string', 'max:255'],
            'installations.*.energy_type' => ['nullable', 'string', 'max:100'],
            'installations.*.description' => ['nullable', 'string'],
            'installations.*.price' => ['nullable', 'numeric', 'min:0'],
            'installations.*.scheduled_at' => ['nullable', 'date'],
            'maintenances' => ['nullable', 'array'],
            'maintenances.*.id' => ['nullable', 'integer'],
            'maintenances.*.type' => ['nullable', 'string', 'max:100'],
            'maintenances.*.description' => ['nullable', 'string'],
            'maintenances.*.price' => ['nullable', 'numeric', 'min:0'],
            'maintenances.*.scheduled_at' => ['nullable', 'date'],
        ];
    }

    private function presentLines(?QuoteRequest $quote): array
    {
        if (! $quote) {
            return [];
        }

        $quote->loadMissing('products');

        return $quote->products->map(function ($product) {
            $quantity = (int) $product->pivot->quantity;
            $unitPrice = (float) $product->pivot->unit_price;

            return [
                'id_product' => $product->id_product,
                'title' => $product->pivot->label ?: $product->title,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
            ];
        })->values()->all();
    }

    private function presentInstallation(Installation $row): array
    {
        return [
            'id' => $row->id_installation,
            'name' => $row->name,
            'energy_type' => $row->energy_type,
            'location' => $row->location,
            'status' => $row->status,
            'description' => $row->description,
            'price' => $row->price,
            'scheduled_at' => optional($row->scheduled_at)->format('Y-m-d\TH:i'),
        ];
    }

    private function presentMaintenance(Maintenance $row): array
    {
        return [
            'id' => $row->id_maintenance,
            'type' => $row->type,
            'description' => $row->description,
            'status' => $row->status,
            'price' => $row->price,
            'scheduled_at' => optional($row->scheduled_at)->format('Y-m-d\TH:i'),
        ];
    }

    private function syncManualLines(Project $project, Request $request, array $lines): void
    {
        $normalized = [];
        foreach ($lines as $line) {
            $id = (int) ($line['id_product'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $normalized[$id] = [
                'quantity' => max(1, min(32767, (int) ($line['quantity'] ?? 1))),
                'unit_price' => round((float) $line['unit_price'], 2),
                'label' => Str::limit(trim((string) ($line['title'] ?? '')), 50, '') ?: null,
                'line_type' => 'product',
            ];
        }

        $quote = $project->quoteRequests()->where('origin', 'manual')->first();

        if ($normalized === []) {
            if ($quote) {
                $quote->products()->detach();
                $quote->delete();
            }

            return;
        }

        $project->loadMissing('client.user');
        $user = $project->client?->user;

        if (! $quote) {
            $quote = QuoteRequest::create([
                'number' => $this->manualNumber($project),
                'company' => $user?->company,
                'email' => $user?->email,
                'status' => 'issued',
                'origin' => 'manual',
                'creation_date' => now(),
                'id_admin' => $request->user()?->administrator?->id_admin,
                'id_project' => $project->id_project,
                'id_client' => $project->id_client,
            ]);
        }

        $quote->products()->sync($normalized);
        $quote->update([
            'total_quantity' => array_sum(array_column($normalized, 'quantity')),
            'amount' => array_sum(array_map(
                fn ($line) => $line['quantity'] * $line['unit_price'],
                $normalized
            )),
        ]);
    }

    private function manualNumber(Project $project): string
    {
        do {
            $number = 'MAN-'.$project->id_project.'-'.Str::upper(Str::random(4));
        } while (QuoteRequest::where('number', $number)->exists());

        return $number;
    }

    private function syncInstallations(Project $project, array $rows): void
    {
        $kept = [];

        foreach ($rows as $row) {
            $name = trim((string) ($row['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $data = [
                'name' => $name,
                'location' => $this->blankToNull($row['location'] ?? null) ?? $project->location,
                'energy_type' => $this->blankToNull($row['energy_type'] ?? null),
                'description' => $this->blankToNull($row['description'] ?? null),
                'price' => $this->blankToNull($row['price'] ?? null),
                'scheduled_at' => $this->blankToNull($row['scheduled_at'] ?? null),
                'status' => 'scheduled',
                'id_client' => $project->id_client,
                'id_project' => $project->id_project,
            ];

            $existing = ! empty($row['id'])
                ? Installation::where('id_installation', $row['id'])->where('id_project', $project->id_project)->first()
                : null;

            if ($existing) {
                $existing->update($data);
                $kept[] = $existing->id_installation;
                continue;
            }

            $created = Installation::create([
                ...$data,
                'creation_date' => now(),
            ]);
            $kept[] = $created->id_installation;
        }

        $query = Installation::where('id_project', $project->id_project);
        if ($kept === []) {
            $query->delete();
        } else {
            $query->whereNotIn('id_installation', $kept)->delete();
        }
    }

    private function syncMaintenances(Project $project, array $rows): void
    {
        $kept = [];

        foreach ($rows as $row) {
            $type = trim((string) ($row['type'] ?? ''));
            if ($type === '') {
                continue;
            }

            $data = [
                'type' => $type,
                'description' => $this->blankToNull($row['description'] ?? null),
                'price' => $this->blankToNull($row['price'] ?? null),
                'scheduled_at' => $this->blankToNull($row['scheduled_at'] ?? null),
                'status' => 'scheduled',
                'id_project' => $project->id_project,
            ];

            $existing = ! empty($row['id'])
                ? Maintenance::where('id_maintenance', $row['id'])->where('id_project', $project->id_project)->first()
                : null;

            if ($existing) {
                $existing->update($data);
                $kept[] = $existing->id_maintenance;
                continue;
            }

            $created = Maintenance::create($data);
            $kept[] = $created->id_maintenance;
        }

        $query = Maintenance::where('id_project', $project->id_project);
        if ($kept === []) {
            $query->delete();
        } else {
            $query->whereNotIn('id_maintenance', $kept)->delete();
        }
    }

    private function blankToNull(mixed $value): mixed
    {
        if ($value === '' || $value === null) {
            return null;
        }

        return $value;
    }

    private function presentMessage(ProjectMessage $message): array
    {
        return [
            'id' => $message->id,
            'body' => $message->body,
            'author' => $message->author,
            'created_at' => optional($message->created_at)->toIso8601String(),
            'user' => $message->user ? [
                'name' => $message->user->name,
            ] : null,
        ];
    }

    private function seedLegacyMessage(Project $project): void
    {
        if ($project->messages()->exists()) {
            return;
        }

        $body = trim((string) $project->description);
        if ($body === '' || preg_match('/^Confirmed order:/i', $body)) {
            return;
        }

        ProjectMessage::create([
            'id_project' => $project->id_project,
            'author' => 'team',
            'body' => $body,
            'created_at' => now(),
        ]);
    }

    private function presentTrace(ProjectTrace $trace): array
    {
        return [
            'id' => $trace->id,
            'summary' => $trace->summary,
            'changes' => $trace->changes ?? [],
            'created_at' => optional($trace->created_at)->toIso8601String(),
            'user' => $trace->user ? [
                'name' => $trace->user->name,
                'email' => $trace->user->email,
            ] : null,
        ];
    }
}
