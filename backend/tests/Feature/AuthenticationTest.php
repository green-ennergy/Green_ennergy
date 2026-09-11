<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'salah eddine',
            'company' => 'Green Energy Company',
            'phone' => '+212 600 123 456',
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(201);

        $response->assertJson([
            'message' => 'User registered successfully',
        ]);

        $response->assertJsonStructure([
            'user' => ['id', 'name', 'company', 'phone', 'email', 'role'],
            'token',
            'message',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'salah eddine',
            'company' => 'Green Energy Company',
            'phone' => '+212 600 123 456',
            'email' => 'salah.eddine@green.com',
            'role' => 'user',
        ]);
    }

    public function test_user_can_login(): void
    {
        // First create the user
        $this->postJson('/api/auth/register', [
            'name' => 'salah eddine',
            'company' => 'Green Energy Company',
            'phone' => '+212 600 123 456',
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        // Then try to login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200);

        $response->assertJsonStructure(['user', 'token', 'message']);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'salah eddine',
            'company' => 'Green Energy Company',
            'phone' => '+212 600 123 456',
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'salah.eddine@green.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401);
    }
    public function test_user_cannot_register_with_existing_email(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'salah eddine',
            'company' => 'Green Energy Company',
            'phone' => '+212 600 123 456',
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Another User',
            'company' => 'Another Company',
            'phone' => '+212 600 111 222',
            'email' => 'salah.eddine@green.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422);
    }
}
