<?php

namespace Database\Seeders;

use App\Models\Administrator;
use App\Models\AiStockAlert;
use App\Models\Attachment;
use App\Models\Category;
use App\Models\Client;
use App\Models\Installation;
use App\Models\Kit;
use App\Models\Maintenance;
use App\Models\Operator;
use App\Models\Order;
use App\Models\Product;
use App\Models\Project;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Users (password for all: password) ---
        $adminUser = User::create([
            'name' => 'Sara Admin',
            'company' => 'Green Energy',
            'email' => 'admin@greenenergy.ma',
            'phone' => '0611000001',
            'password' => 'password',
            'email_verified_at' => now(),
            'creation_date' => now()->toDateString(),
        ]);

        $operatorUser = User::create([
            'name' => 'Youssef Operator',
            'company' => 'Green Energy',
            'email' => 'operator@greenenergy.ma',
            'phone' => '0611000002',
            'password' => 'password',
            'email_verified_at' => now(),
            'creation_date' => now()->toDateString(),
        ]);

        $clientUser = User::create([
            'name' => 'Amine Client',
            'company' => 'Casa Industrie',
            'email' => 'client@casa-industrie.ma',
            'phone' => '0611000003',
            'password' => 'password',
            'email_verified_at' => now(),
            'creation_date' => now()->toDateString(),
        ]);

        $clientUser2 = User::create([
            'name' => 'Fatima Zahra',
            'company' => 'AgriSolar Marrakech',
            'email' => 'fatima@agrisolar.ma',
            'phone' => '0611000004',
            'password' => 'password',
            'email_verified_at' => now(),
            'creation_date' => now()->toDateString(),
        ]);

        // --- Roles ---
        $admin = Administrator::create(['id_user' => $adminUser->id_user]);
        $operator = Operator::create(['id_user' => $operatorUser->id_user]);
        $client = Client::create(['id_user' => $clientUser->id_user]);
        $client2 = Client::create(['id_user' => $clientUser2->id_user]);

        // --- Categories ---
        $solar = Category::create([
            'name' => 'Solar Panels',
            'slug' => 'solar-panels',
            'description' => 'Photovoltaic panels for residential and industrial use',
        ]);

        $batteries = Category::create([
            'name' => 'Batteries',
            'slug' => 'batteries',
            'description' => 'Energy storage systems',
        ]);

        $inverters = Category::create([
            'name' => 'Inverters',
            'slug' => 'inverters',
            'description' => 'DC to AC power converters',
        ]);

        // --- Products ---
        $panel = Product::create([
            'reference' => 'PV-450W',
            'title' => 'Solar Panel 450W',
            'rating' => 4.7,
            'stock' => 120,
            'sales' => 35,
            'description' => 'High-efficiency monocrystalline panel',
            'climate_info' => 'Suitable for hot and dry climates',
            'capacity' => 450,
            'weight_kg' => 22.5,
            'surface' => 2.1,
            'id_category' => $solar->id_category,
        ]);

        $battery = Product::create([
            'reference' => 'BAT-5KWH',
            'title' => 'Lithium Battery 5kWh',
            'rating' => 4.5,
            'stock' => 40,
            'sales' => 12,
            'description' => 'Home energy storage battery',
            'climate_info' => 'Indoor installation recommended',
            'capacity' => 5,
            'weight_kg' => 48,
            'surface' => 0.4,
            'id_category' => $batteries->id_category,
        ]);

        $inverter = Product::create([
            'reference' => 'INV-5KW',
            'title' => 'Hybrid Inverter 5kW',
            'rating' => 4.6,
            'stock' => 8,
            'sales' => 18,
            'description' => 'Hybrid inverter with battery support',
            'climate_info' => 'Ventilated outdoor enclosure',
            'capacity' => 5,
            'weight_kg' => 18,
            'surface' => 0.3,
            'id_category' => $inverters->id_category,
        ]);

        // --- Kit composed of products ---
        $kit = Kit::create([
            'name' => 'Home Solar Starter Kit',
            'description' => '3 panels + battery + inverter for small homes',
            'status' => 'published',
            'creation_date' => now(),
            'id_admin' => $admin->id_admin,
        ]);

        $kit->products()->attach([
            $panel->id_product => ['quantity' => 3, 'role' => 'generation', 'priority' => 'high'],
            $battery->id_product => ['quantity' => 1, 'role' => 'storage', 'priority' => 'medium'],
            $inverter->id_product => ['quantity' => 1, 'role' => 'conversion', 'priority' => 'high'],
        ]);

        // --- Project ---
        $project = Project::create([
            'name' => 'Casa Industrie Rooftop',
            'type' => 'industrial',
            'progress' => 40,
            'status' => 'in_progress',
            'completed_steps' => ['site_survey', 'energy_audit'],
            'description' => 'Rooftop solar installation for factory buildings',
            'location' => 'Casablanca',
            'energy_need' => '80 kWh/day',
            'collection_data' => ['roof_area_m2' => 450, 'orientation' => 'south'],
            'energy_data' => ['peak_load_kw' => 25, 'grid_backup' => true],
            'admin_notes' => 'Priority client — follow up weekly',
            'start_date' => now()->subDays(20)->toDateString(),
            'end_date' => now()->addMonths(2)->toDateString(),
            'id_client' => $client->id_client,
        ]);

        // --- Attachment ---
        Attachment::create([
            'file_name' => 'site-survey.pdf',
            'path' => 'attachments/projects/site-survey.pdf',
            'file_type' => 'application/pdf',
            'uploaded_at' => now(),
            'id_project' => $project->id_project,
            'id_user' => $clientUser->id_user,
        ]);

        // --- Quote request ---
        $quote = QuoteRequest::create([
            'number' => 'Q-2026-001',
            'company' => 'Casa Industrie',
            'email' => 'client@casa-industrie.ma',
            'status' => 'pending',
            'total_quantity' => 5,
            'amount' => 28500,
            'client_confirmed' => false,
            'stock_deducted' => false,
            'creation_date' => now(),
            'id_admin' => $admin->id_admin,
            'id_project' => $project->id_project,
            'id_client' => $client->id_client,
        ]);

        $quote->products()->attach([
            $panel->id_product => [
                'label' => 'Solar Panel 450W',
                'unit_price' => 2500,
                'line_type' => 'product',
                'quantity' => 3,
            ],
            $inverter->id_product => [
                'label' => 'Hybrid Inverter 5kW',
                'unit_price' => 8500,
                'line_type' => 'product',
                'quantity' => 1,
            ],
            $battery->id_product => [
                'label' => 'Lithium Battery 5kWh',
                'unit_price' => 12000,
                'line_type' => 'product',
                'quantity' => 1,
            ],
        ]);

        // --- Order ---
        $order = Order::create([
            'number' => 'ORD-2026-001',
            'status' => 'confirmed',
            'amount' => 14500,
            'creation_date' => now()->subDays(5),
            'id_client' => $client2->id_client,
        ]);

        $order->products()->attach([
            $panel->id_product => ['quantity' => 2, 'unit_price' => 2500],
            $battery->id_product => ['quantity' => 1, 'unit_price' => 9500],
        ]);

        // --- Installation + maintenance ---
        $installation = Installation::create([
            'name' => 'Casa Industrie Phase 1',
            'energy_type' => 'solar',
            'location' => 'Casablanca — Building A',
            'status' => 'scheduled',
            'creation_date' => now(),
            'id_project' => $project->id_project,
            'id_operator' => $operator->id_operator,
            'id_client' => $client->id_client,
        ]);

        Maintenance::create([
            'type' => 'preventive',
            'scheduled_at' => now()->addDays(15),
            'status' => 'scheduled',
            'description' => 'First inspection after commissioning',
            'id_installation' => $installation->id_installation,
            'id_operator' => $operator->id_operator,
        ]);

        // --- AI stock alert (low stock inverter) ---
        AiStockAlert::create([
            'risk_level' => 'high',
            'analyzed_stock' => 8,
            'forecasted_sales' => 20,
            'quantity_to_order' => 25,
            'confidence' => 88,
            'reasons' => ['low_stock', 'rising_demand', 'kit_dependency'],
            'analyzed_at' => now(),
            'id_product' => $inverter->id_product,
        ]);
    }
}
