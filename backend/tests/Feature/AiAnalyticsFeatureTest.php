<?php

namespace Tests\Feature;

use App\Models\Administrator;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AiAnalyticsFeatureTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): User
    {
        $user = User::create([
            'name' => 'Admin User',
            'company' => 'Test Co',
            'email' => 'admin-ai@test.ma',
            'phone' => '0611223344',
            'password' => 'password',
            'creation_date' => now()->toDateString(),
        ]);

        Administrator::create(['id_user' => $user->id_user]);

        return $user->fresh();
    }

    private function seedProduct(): Product
    {
        $category = Category::create([
            'name' => 'Solar Panels',
            'slug' => 'solar-panels',
            'description' => 'Panels',
        ]);

        return Product::create([
            'reference' => 'PV-TEST',
            'title' => 'Solar Panel 450W',
            'rating' => 4.5,
            'stock' => 10,
            'sales' => 20,
            'description' => 'Test panel',
            'id_category' => $category->id_category,
        ]);
    }

    public function test_guest_cannot_access_ai_overview(): void
    {
        $this->getJson('/api/admin/ai/overview')->assertUnauthorized();
    }

    public function test_admin_receives_ai_overview_from_live_catalog(): void
    {
        config(['services.ai_backend.url' => 'http://ai_backend:8001']);

        $product = $this->seedProduct();

        Http::fake([
            'http://ai_backend:8001/api/ai/analyze' => Http::response([
                'last_analysis' => '10:00',
                'stats' => ['total' => 1, 'high' => 1, 'avgDemand' => 70],
                'recommendations' => [[
                    'id' => $product->id_product,
                    'name' => $product->title,
                    'icon_type' => 'sun',
                    'stock' => 10,
                    'avgSales' => 20,
                    'demand' => 70,
                    'risk' => 'high',
                    'restock' => 15,
                    'expectedSales' => 25,
                    'confidence' => 90,
                    'deadline' => '25 Août',
                    'reasons' => ['Low stock'],
                ]],
                'products' => [[
                    'id' => $product->id_product,
                    'name' => $product->title,
                    'icon_type' => 'sun',
                    'stock' => 10,
                    'avgSales' => 20,
                    'demand' => 70,
                    'risk' => 'high',
                    'restock' => 15,
                    'expectedSales' => 25,
                    'confidence' => 90,
                    'deadline' => '25 Août',
                    'reasons' => ['Low stock'],
                ]],
                'topProducts' => [],
                'trends' => [],
                'assistant_insights' => ['Restock needed'],
                'assistant_time' => 'Généré aujourd\'hui à 10:00',
            ], 200),
        ]);

        Sanctum::actingAs($this->makeAdmin());

        $response = $this->getJson('/api/admin/ai/overview');

        $response->assertOk()
            ->assertJsonPath('last_analysis', '10:00')
            ->assertJsonPath('products.0.id', $product->id_product)
            ->assertJsonPath('assistant_insights.0', 'Restock needed');

        $this->assertDatabaseHas('ai_stock_alerts', [
            'id_product' => $product->id_product,
            'risk_level' => 'high',
            'quantity_to_order' => 15,
        ]);
    }

    public function test_admin_restock_updates_stock_and_persists_alert(): void
    {
        config(['services.ai_backend.url' => 'http://ai_backend:8001']);

        $product = $this->seedProduct();

        Http::fake([
            'http://ai_backend:8001/api/ai/restock-order' => Http::response([
                'success' => true,
                'message' => 'Bon de commande créé',
                'order_id' => 'CMD-TEST',
                'status' => 'pending_approval',
            ], 200),
        ]);

        Sanctum::actingAs($this->makeAdmin());

        $response = $this->postJson('/api/admin/ai/restock-order', [
            'product_id' => $product->id_product,
            'units' => 12,
            'notes' => 'Test order',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('new_stock', 22);

        $this->assertDatabaseHas('products', [
            'id_product' => $product->id_product,
            'stock' => 22,
        ]);

        $this->assertDatabaseHas('ai_stock_alerts', [
            'id_product' => $product->id_product,
            'risk_level' => 'restock_ordered',
            'quantity_to_order' => 12,
        ]);
    }
}
