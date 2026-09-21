<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::query()->orderBy('sort_order')->orderBy('id_service');

        if (! $request->user()?->isAdministrator()) {
            $query->where('enabled', true);
        } elseif ($request->query('enabled') === '1') {
            $query->where('enabled', true);
        } elseif ($request->query('enabled') === '0') {
            $query->where('enabled', false);
        }

        $services = $query->get()->map(fn (Service $service) => $this->present($service));

        return response()->json(['data' => $services]);
    }

    public function show(string $service): JsonResponse
    {
        $model = $this->resolveService($service);

        if (! $model->enabled && ! request()->user()?->isAdministrator()) {
            abort(404, 'Service not found');
        }

        return response()->json($this->present($model));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateService($request);

        $service = Service::create([
            ...$validated,
            'slug' => $validated['slug'] ?? $this->uniqueSlug($validated['title']),
            'description' => $validated['description'] ?? $validated['desc'] ?? null,
            'estimated_duration' => $validated['estimated_duration'] ?? $validated['estimatedDuration'] ?? null,
            'starting_price' => $validated['starting_price'] ?? $validated['startingPrice'] ?? null,
            'realization_steps' => $validated['realization_steps'] ?? $this->defaultSteps(),
            'bullets' => $validated['bullets'] ?? [],
            'icon' => $validated['icon'] ?? 'installation',
            'enabled' => $validated['enabled'] ?? true,
            'sort_order' => $validated['sort_order'] ?? ((int) Service::max('sort_order') + 1),
            'creation_date' => now(),
        ]);

        return response()->json([
            'service' => $this->present($service),
            'message' => 'Service created',
        ], 201);
    }

    public function update(Request $request, string $service): JsonResponse
    {
        $model = $this->resolveService($service);
        $validated = $this->validateService($request, $model, partial: true);

        if (array_key_exists('desc', $validated) && ! array_key_exists('description', $validated)) {
            $validated['description'] = $validated['desc'];
        }
        if (array_key_exists('estimatedDuration', $validated) && ! array_key_exists('estimated_duration', $validated)) {
            $validated['estimated_duration'] = $validated['estimatedDuration'];
        }
        if (array_key_exists('startingPrice', $validated) && ! array_key_exists('starting_price', $validated)) {
            $validated['starting_price'] = $validated['startingPrice'];
        }

        unset($validated['desc'], $validated['estimatedDuration'], $validated['startingPrice']);

        $model->update($validated);

        return response()->json([
            'service' => $this->present($model->fresh()),
            'message' => 'Service updated',
        ]);
    }

    public function destroy(string $service): JsonResponse
    {
        $this->resolveService($service)->delete();

        return response()->json(['message' => 'Service deleted']);
    }

    private function resolveService(string $service): Service
    {
        return Service::query()
            ->where(function ($query) use ($service) {
                $query->where('slug', $service);

                if (ctype_digit($service)) {
                    $query->orWhere('id_service', (int) $service);
                }
            })
            ->firstOrFail();
    }

    private function validateService(Request $request, ?Service $service = null, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('services', 'slug')->ignore($service?->id_service, 'id_service'),
            ],
            'description' => ['nullable', 'string'],
            'desc' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'estimated_duration' => ['nullable', 'string', 'max:100'],
            'estimatedDuration' => ['nullable', 'string', 'max:100'],
            'starting_price' => ['nullable', 'string', 'max:100'],
            'startingPrice' => ['nullable', 'string', 'max:100'],
            'enabled' => ['sometimes', 'boolean'],
            'bullets' => ['nullable', 'array'],
            'bullets.*' => ['string', 'max:255'],
            'realization_steps' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function present(Service $service): array
    {
        return [
            'id' => $service->slug,
            'id_service' => $service->id_service,
            'slug' => $service->slug,
            'title' => $service->title,
            'desc' => $service->description,
            'description' => $service->description,
            'category' => $service->category,
            'icon' => $service->icon,
            'estimatedDuration' => $service->estimated_duration,
            'startingPrice' => $service->starting_price,
            'enabled' => (bool) $service->enabled,
            'bullets' => $service->bullets ?? [],
            'realizationSteps' => $service->realization_steps ?? $this->defaultSteps(),
            'sort_order' => $service->sort_order,
        ];
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'service';
        $slug = $base;
        $i = 1;

        while (
            Service::query()
                ->when($ignoreId, fn ($q) => $q->where('id_service', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    private function defaultSteps(): array
    {
        return [
            ['step' => 1, 'key' => 'received', 'title' => 'Request Logged', 'desc' => 'Service request received by dispatch.'],
            ['step' => 2, 'key' => 'review', 'title' => 'Review & Planning', 'desc' => 'Technical assessment and planning.'],
            ['step' => 3, 'key' => 'assigned', 'title' => 'Operator Assigned', 'desc' => 'Field technician assigned.'],
            ['step' => 4, 'key' => 'in_progress', 'title' => 'In Progress', 'desc' => 'On-site work underway.'],
            ['step' => 5, 'key' => 'completed', 'title' => 'Completed', 'desc' => 'Service completed and handed over.'],
        ];
    }
}
