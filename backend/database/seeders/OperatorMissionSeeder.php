<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\MissionTrace;
use App\Models\Operator;
use App\Support\MissionTypeData;
use App\Support\ServiceRequestMissionSync;
use Illuminate\Database\Seeder;

/**
 * Idempotent demo missions for the operator field console.
 * Safe to run on an existing database: php artisan db:seed --class=OperatorMissionSeeder
 */
class OperatorMissionSeeder extends Seeder
{
    public function run(): void
    {
        $operator = Operator::with('user')->orderBy('id_operator')->first();
        if (! $operator) {
            $this->command?->warn('No operator found — skip OperatorMissionSeeder.');

            return;
        }

        $existing = Mission::where('id_operator', $operator->id_operator)->count();
        if ($existing >= 4) {
            // Still hydrate empty type_data on existing rows
            Mission::where('id_operator', $operator->id_operator)->each(function (Mission $mission) {
                $mission->type_data = MissionTypeData::forType(
                    $mission->type,
                    is_array($mission->type_data) ? $mission->type_data : []
                );
                $mission->save();
            });
            $this->command?->info("Operator already has {$existing} missions — type_data hydrated.");

            return;
        }

        $operator->update([
            'role' => $operator->role ?: 'Field operator',
            'city' => $operator->city ?: 'Casablanca',
            'duty_status' => $operator->duty_status ?: 'on_duty',
            'specialties' => $operator->specialties ?: ['installation', 'maintenance', 'delivery', 'study'],
        ]);

        $seeds = [
            [
                'type' => 'installation',
                'title' => 'Rooftop install — Casa Industrie',
                'priority' => 'high',
                'scheduled_date' => now()->toDateString(),
                'time_slot' => '09:00 - 13:00',
                'client_name' => 'Amine Client',
                'client_phone' => '0611000003',
                'client_email' => 'client@casa-industrie.ma',
                'client_address' => 'Casa Industrie Rooftop',
                'client_city' => 'Casablanca',
                'admin_notes' => 'Commission 450W string on south roof.',
                'type_data' => [
                    'equipmentList' => [
                        ['name' => 'Solar Panel 450W', 'qty' => 6, 'checked' => false],
                        ['name' => 'Hybrid Inverter 5kW', 'qty' => 1, 'checked' => false],
                    ],
                ],
            ],
            [
                'type' => 'maintenance',
                'title' => 'Inverter fault check — AgriSolar',
                'priority' => 'urgent',
                'scheduled_date' => now()->toDateString(),
                'time_slot' => '14:00 - 17:00',
                'client_name' => 'Fatima Zahra',
                'client_phone' => '0611000004',
                'client_email' => 'fatima@agrisolar.ma',
                'client_address' => 'Route de l’Ourika',
                'client_city' => 'Marrakech',
                'admin_notes' => 'Intermittent inverter alarms.',
                'type_data' => [
                    'systemAge' => '3 years',
                    'inverterModel' => 'INV-5KW',
                    'systemCapacity' => '5 kWp',
                    'reportedFault' => 'Intermittent inverter fault / production drop',
                ],
            ],
            [
                'type' => 'delivery',
                'title' => 'Catalog delivery — Casablanca',
                'priority' => 'medium',
                'scheduled_date' => now()->addDay()->toDateString(),
                'time_slot' => '08:30 - 11:30',
                'client_name' => 'Amine Client',
                'client_phone' => '0611000003',
                'client_email' => 'client@casa-industrie.ma',
                'client_address' => 'Warehouse dock B',
                'client_city' => 'Casablanca',
                'admin_notes' => 'Get recipient signature on hand-off.',
                'type_data' => [
                    'orderNumber' => 'ORD-DEMO01',
                    'stagingBay' => 'Bay B',
                ],
            ],
            [
                'type' => 'study',
                'title' => 'Home solar feasibility audit',
                'priority' => 'medium',
                'scheduled_date' => now()->addDays(2)->toDateString(),
                'time_slot' => '10:30 - 12:30',
                'client_name' => 'Fatima Zahra',
                'client_phone' => '0611000004',
                'client_email' => 'fatima@agrisolar.ma',
                'client_address' => 'Villa Ourika',
                'client_city' => 'Marrakech',
                'admin_notes' => 'Collect bill + roof measurements.',
                'type_data' => [
                    'monthlyBillMAD' => 1800,
                    'estimatedKWhMonthly' => 620,
                    'roofAreaM2' => 55,
                ],
            ],
        ];

        foreach ($seeds as $seed) {
            $mission = Mission::create([
                'code' => 'TSK-'.strtoupper(substr($seed['type'], 0, 4)).'-'.random_int(100, 999),
                'type' => $seed['type'],
                'title' => $seed['title'],
                'status' => 'assigned',
                'priority' => $seed['priority'],
                'scheduled_date' => $seed['scheduled_date'],
                'time_slot' => $seed['time_slot'],
                'client_name' => $seed['client_name'],
                'client_phone' => $seed['client_phone'],
                'client_email' => $seed['client_email'],
                'client_address' => $seed['client_address'],
                'client_city' => $seed['client_city'],
                'admin_notes' => $seed['admin_notes'],
                'type_data' => MissionTypeData::forType($seed['type'], $seed['type_data']),
                'id_operator' => $operator->id_operator,
            ]);

            MissionTrace::create([
                'id_mission' => $mission->id,
                'actor' => 'Admin',
                'action' => 'Created and assigned to '.($operator->user?->name ?: 'operator'),
                'created_at' => now(),
            ]);
        }

        $this->command?->info('Seeded demo missions for operator #'.$operator->id_operator);

        $backfilled = ServiceRequestMissionSync::backfillMissing();
        if ($backfilled > 0) {
            $this->command?->info("Backfilled {$backfilled} mission(s) from assigned service requests.");
        }
    }
}
