<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'phone' => ['required', 'string', 'max:20', 'regex:/^[+0-9\s\-()]{8,20}$/'],
            'email' => 'required|string|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'company' => $validated['company'],
                'phone' => preg_replace('/\s+/', ' ', trim($validated['phone'])),
                'email' => $validated['email'],
                'password' => $validated['password'],
                'creation_date' => now(),
            ]);

            Client::create([
                'id_user' => $user->id_user,
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $this->presentUser($user),
            'token' => $token,
            'message' => 'User registered successfully',
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $this->presentUser($user),
            'token' => $token,
            'message' => 'Login successful',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($this->presentUser($request->user()));
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company' => 'sometimes|string|max:255',
            'phone' => ['sometimes', 'string', 'max:20', 'regex:/^[+0-9\s\-()]{8,20}$/'],
        ]);

        if (isset($validated['phone'])) {
            $validated['phone'] = preg_replace('/\s+/', ' ', trim($validated['phone']));
        }

        $request->user()->update($validated);

        return response()->json([
            'user' => $this->presentUser($request->user()->fresh()),
            'message' => 'Profile updated successfully',
        ]);
    }

    private function presentUser(User $user): User
    {
        $user->loadMissing('client');

        return $user->makeHidden(['client']);
    }
}
