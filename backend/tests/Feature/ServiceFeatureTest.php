<?php

namespace Tests\Feature;

use App\Models\Administrator;
use App\Models\Client;
use App\Models\Operator;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceFeatureTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $email, string $role = 'client'): User
    {
        $user = User::create([
            'name' => ucfirst($role).' User',
            'company' => 'Test Co',
            'email' => $email,
            'phone' => '0611223344',
            'password' => 'password',
            'creation_date' => now()->toDateString(),
        ]);

        if ($role === 'administrator') {
            Administrator::create(['id_user' => $user->id_user]);
        } elseif ($role === 'operator') {
            Operator::create(['id_user' => $user->id_user]);
        } else {
            Client::create(['id_user' => $user->id_user]);
        }

        return $user->fresh();
    }

    private function seedService(array $overrides = []): Service
    {
        return Service::create(array_merge([
            'slug' => 'installation',
            'title' => 'Solar Installation',
            'description' => 'Install panels',
            'category' => 'Engineering',
            'icon' => 'installation',
            'estimated_duration' => '1-3 Days',
            'starting_price' => '4500 MAD',
            'enabled' => true,
            'bullets' => ['Audit', 'Mounting'],
            'realization_steps' => [
                ['step' => 1, 'key' => 'received', 'title' => 'Request logged', 'desc' => 'Logged'],
                ['step' => 2, 'key' => 'review', 'title' => 'Review', 'desc' => 'Review'],
                ['step' => 3, 'key' => 'assigned', 'title' => 'Assigned', 'desc' => 'Assigned'],
                ['step' => 4, 'key' => 'in_progress', 'title' => 'In progress', 'desc' => 'Working'],
                ['step' => 5, 'key' => 'completed', 'title' => 'Completed', 'desc' => 'Done'],
            ],
            'sort_order' => 1,
            'creation_date' => now(),
        ], $overrides));
    }

    public function test_public_index_hides_disabled_services(): void
    {
        $this->seedService(['slug' => 'on', 'title' => 'On', 'enabled' => true]);
        $this->seedService(['slug' => 'off', 'title' => 'Off', 'enabled' => false]);

        $response = $this->getJson('/api/services');

        $response->assertOk();
        $slugs = collect($response->json('data'))->pluck('id')->all();
        $this->assertContains('on', $slugs);
        $this->assertNotContains('off', $slugs);
    }

    public function test_admin_can_crud_services_by_slug(): void
    {
        $admin = $this->makeUser('admin@test.ma', 'administrator');
        Sanctum::actingAs($admin);

        $create = $this->postJson('/api/admin/services', [
            'title' => 'Roof Cleaning',
            'category' => 'Maintenance',
            'desc' => 'Clean panels',
            'startingPrice' => '900 MAD',
            'estimatedDuration' => '2 Hours',
            'enabled' => true,
            'bullets' => ['Wash', 'Inspect'],
        ]);

        $create->assertCreated();
        $slug = $create->json('service.id');
        $this->assertNotEmpty($slug);

        $update = $this->patchJson('/api/admin/services/'.$slug, [
            'enabled' => false,
            'startingPrice' => '950 MAD',
        ]);
        $update->assertOk();
        $update->assertJsonPath('service.enabled', false);
        $update->assertJsonPath('service.startingPrice', '950 MAD');

        $this->assertDatabaseHas('services', ['slug' => $slug, 'enabled' => false]);

        $delete = $this->deleteJson('/api/admin/services/'.$slug);
        $delete->assertOk();
        $this->assertDatabaseMissing('services', ['slug' => $slug]);
    }

    public function test_client_can_create_service_request(): void
    {
        $service = $this->seedService();
        $client = $this->makeUser('client@test.ma', 'client');
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/service-requests', [
            'service_id' => $service->slug,
            'clientName' => 'Amine Client',
            'clientEmail' => 'client@test.ma',
            'clientPhone' => '0611000003',
            'city' => 'Casablanca',
            'address' => 'Site A',
            'preferredDate' => now()->addDays(3)->toDateString(),
            'notes' => 'Rooftop access via stairs',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('request.serviceId', 'installation');
        $response->assertJsonPath('request.currentPhase', 1);
        $this->assertDatabaseCount('service_requests', 1);
    }

    public function test_admin_assigns_and_operator_updates_phase(): void
    {
        $service = $this->seedService();
        $admin = $this->makeUser('admin@test.ma', 'administrator');
        $operatorUser = $this->makeUser('op@test.ma', 'operator');
        $client = $this->makeUser('client@test.ma', 'client');
        $operatorId = $operatorUser->operator->id_operator;

        $request = ServiceRequest::create([
            'number' => 'SRV-2026-TEST',
            'id_service' => $service->id_service,
            'id_client' => $client->client->id_client,
            'client_name' => 'Amine',
            'client_email' => 'client@test.ma',
            'client_phone' => '0611',
            'city' => 'Casa',
            'address' => 'Addr',
            'notes' => null,
            'preferred_date' => now()->toDateString(),
            'status' => 'pending',
            'current_phase' => 1,
            'history' => [['date' => now()->format('Y-m-d H:i'), 'actor' => 'Client', 'text' => 'Created']],
            'creation_date' => now(),
        ]);

        Sanctum::actingAs($admin);
        $assign = $this->patchJson('/api/service-requests/'.$request->number, [
            'id_operator' => $operatorId,
            'status' => 'accepted',
        ]);
        $assign->assertOk();
        $assign->assertJsonPath('request.assignedOperatorId', $operatorId);

        Sanctum::actingAs($operatorUser);
        $phase = $this->patchJson('/api/service-requests/'.$request->number, [
            'current_phase' => 4,
        ]);
        $phase->assertOk();
        $phase->assertJsonPath('request.currentPhase', 4);

        Sanctum::actingAs($this->makeUser('other-op@test.ma', 'operator'));
        $forbidden = $this->patchJson('/api/service-requests/'.$request->number, [
            'current_phase' => 5,
        ]);
        $forbidden->assertStatus(403);
    }

    public function test_store_requires_contact_fields(): void
    {
        $this->seedService();
        $client = $this->makeUser('client@test.ma', 'client');
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/service-requests', [
            'service_id' => 'installation',
            'clientName' => 'Amine',
            'clientEmail' => 'client@test.ma',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['clientPhone', 'city', 'address', 'preferredDate']);
    }
}
