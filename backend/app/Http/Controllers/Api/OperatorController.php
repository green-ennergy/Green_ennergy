<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operator;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OperatorController extends Controller
{
    public function index(): JsonResponse
    {
        $operators = Operator::with('user')
            ->withCount([
                'missions as active_missions_count' => function ($query) {
                    $query->whereIn('status', ['assigned', 'in_progress']);
                },
            ])
            ->orderByDesc('id_operator')
            ->get()
            ->map(fn (Operator $operator) => $this->present($operator));

        return response()->json(['data' => $operators]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email:filter', 'max:50', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:50'],
            'role' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8', 'max:100'],
            'company' => ['nullable', 'string', 'max:50'],
        ]);

        $temporaryPassword = $validated['password'] ?? Str::password(12);

        $operator = DB::transaction(function () use ($validated, $temporaryPassword) {
            $user = User::create([
                'name' => $validated['name'],
                'company' => $validated['company'] ?? 'Green Energy',
                'email' => strtolower(trim($validated['email'])),
                'phone' => $validated['phone'] ?? null,
                'password' => $temporaryPassword,
                'creation_date' => now()->toDateString(),
            ]);

            return Operator::create([
                'id_user' => $user->id_user,
                'role' => $validated['role'] ?? 'Field operator',
                'city' => $validated['city'] ?? null,
                'duty_status' => 'on_duty',
                'specialties' => ['installation'],
            ]);
        });

        $operator->load('user');
        $operator->active_missions_count = 0;

        return response()->json([
            'operator' => $this->present($operator),
            'temporary_password' => $validated['password'] ?? $temporaryPassword,
        ], 201);
    }

    public function update(Request $request, Operator $operator): JsonResponse
    {
        $operator->load('user');

        if (! $operator->user) {
            return response()->json(['message' => 'Operator has no linked user account.'], 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'email' => [
                'required',
                'string',
                'email:filter',
                'max:50',
                Rule::unique('users', 'email')->ignore($operator->user->id_user, 'id_user'),
            ],
            'phone' => ['required', 'string', 'max:50'],
            'role' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $operator->user->update([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
        ]);

        $operator->update([
            'role' => $validated['role'] ?: $operator->role,
            'city' => $validated['city'] ?? null,
        ]);

        $operator->load('user')->loadCount([
            'missions as active_missions_count' => function ($query) {
                $query->whereIn('status', ['assigned', 'in_progress']);
            },
        ]);

        return response()->json([
            'operator' => $this->present($operator),
        ]);
    }

    public function destroy(Operator $operator): JsonResponse
    {
        $operator->load('user');
        $user = $operator->user;
        $operator->delete();
        $user?->delete();

        return response()->json(['message' => 'Operator removed.']);
    }

    public function me(Request $request): JsonResponse
    {
        $operator = $request->user()->operator;
        abort_unless($operator, 404);
        $operator->load('user')->loadCount([
            'missions as active_missions_count' => function ($query) {
                $query->whereIn('status', ['assigned', 'in_progress']);
            },
        ]);

        return response()->json([
            'operator' => $this->present($operator),
            'duty_status' => $operator->duty_status,
        ]);
    }

    public function updateDuty(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'duty_status' => ['required', Rule::in(['on_duty', 'on_break', 'off_duty'])],
        ]);

        $operator = $request->user()->operator;
        abort_unless($operator, 404);
        $operator->update(['duty_status' => $validated['duty_status']]);
        $operator->load('user');

        return response()->json([
            'duty_status' => $operator->duty_status,
            'operator' => $this->present($operator),
        ]);
    }

    private function present(Operator $operator): array
    {
        $user = $operator->user;

        return [
            'id' => $operator->id_operator,
            'name' => $user?->name,
            'email' => $user?->email,
            'phone' => $user?->phone,
            'role' => $operator->role,
            'city' => $operator->city,
            'dutyStatus' => $operator->duty_status === 'on_duty' ? 'onDuty' : $operator->duty_status,
            'specialties' => $operator->specialties ?? [],
            'activeJobs' => (int) ($operator->active_missions_count ?? 0),
        ];
    }
}
