<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            [
                'slug' => 'installation',
                'title' => 'Solar System Installation',
                'description' => 'Professional rooftop & ground-mounted solar equipment installation by certified renewable energy engineers.',
                'category' => 'Engineering & Setup',
                'icon' => 'installation',
                'estimated_duration' => '1-3 Days',
                'starting_price' => '4,500 MAD',
                'bullets' => [
                    'Site structural & roof weight integrity audit',
                    'Tier-1 panel mounting & ballasted racking',
                    'Inverter AC/DC wiring & earthing protection',
                    'Grid synchronization & utility approval assistance',
                ],
                'realization_steps' => [
                    ['step' => 1, 'key' => 'received', 'title' => 'Request Logged', 'desc' => 'Service request received by Green_energy dispatch.'],
                    ['step' => 2, 'key' => 'review', 'title' => 'Site Review & Engineering', 'desc' => 'Technical assessment and permit checks.'],
                    ['step' => 3, 'key' => 'assigned', 'title' => 'Operator & Crew Dispatched', 'desc' => 'Field technician assigned with equipment manifest.'],
                    ['step' => 4, 'key' => 'in_progress', 'title' => 'On-Site Installation', 'desc' => 'Racking, panel wiring, inverter setup & earthing.'],
                    ['step' => 5, 'key' => 'completed', 'title' => 'Commissioned & Handover', 'desc' => 'Live grid testing & client app pairing completed.'],
                ],
                'sort_order' => 1,
            ],
            [
                'slug' => 'maintenance',
                'title' => 'Preventative & Emergency Maintenance',
                'description' => '24/7 array diagnostics, string voltage checks, panel thermal scanning, and inverter fault repair.',
                'category' => 'Operation & Support',
                'icon' => 'maintenance',
                'estimated_duration' => '2-4 Hours',
                'starting_price' => '800 MAD',
                'bullets' => [
                    'Inverter fault code diagnosis (Growatt, Deye, Huawei)',
                    'Solar string IV-curve voltage testing',
                    'Thermal imaging for hotspot detection',
                    'Battery bank health diagnostic & BMS rebalancing',
                ],
                'realization_steps' => [
                    ['step' => 1, 'key' => 'received', 'title' => 'Ticket Logged', 'desc' => 'Maintenance request registered in operations.'],
                    ['step' => 2, 'key' => 'review', 'title' => 'Diagnostic Triage', 'desc' => 'Remote error code log review by lead engineer.'],
                    ['step' => 3, 'key' => 'assigned', 'title' => 'Field Tech Assigned', 'desc' => 'Maintenance operator dispatched with diagnostic tools.'],
                    ['step' => 4, 'key' => 'in_progress', 'title' => 'On-Site Repair & Cleaning', 'desc' => 'Fault resolution, part replacement & string testing.'],
                    ['step' => 5, 'key' => 'completed', 'title' => 'Service Certified', 'desc' => 'System restored to peak operating efficiency.'],
                ],
                'sort_order' => 2,
            ],
            [
                'slug' => 'consultation',
                'title' => 'Electricity Audit & Solar Study',
                'description' => 'Comprehensive electrical consumption study, shading simulation, and financial ROI payback analysis.',
                'category' => 'Advisory & Sizing',
                'icon' => 'study',
                'estimated_duration' => '24-48 Hours',
                'starting_price' => 'FREE',
                'bullets' => [
                    'Utility bill analysis (ONEE / Lydec / Redal)',
                    'Roof 3D shading & solar irradiance simulation',
                    'Hybrid inverter & LiFePO4 battery sizing',
                    'Financial ROI breakdown & payback period report',
                ],
                'realization_steps' => [
                    ['step' => 1, 'key' => 'received', 'title' => 'Audit Requested', 'desc' => 'Free solar study request submitted.'],
                    ['step' => 2, 'key' => 'review', 'title' => 'Bill & Load Modeling', 'desc' => 'Hourly electricity consumption curve modeling.'],
                    ['step' => 3, 'key' => 'assigned', 'title' => 'Energy Analyst Assigned', 'desc' => 'Senior analyst assigned to site report.'],
                    ['step' => 4, 'key' => 'in_progress', 'title' => 'Study Generation', 'desc' => 'Generating solar kWp recommendation & ROI chart.'],
                    ['step' => 5, 'key' => 'completed', 'title' => 'Report Delivered', 'desc' => 'Personalized solar study delivered with quotation.'],
                ],
                'sort_order' => 3,
            ],
            [
                'slug' => 'delivery',
                'title' => 'Equipment Transport & Delivery',
                'description' => 'Secure logistics & insured delivery for solar panels, lithium batteries, and heavy mounting hardware.',
                'category' => 'Logistics & Supply',
                'icon' => 'delivery',
                'estimated_duration' => 'Same / Next Day',
                'starting_price' => '350 MAD',
                'bullets' => [
                    'Insured transport for fragile glass panels & batteries',
                    'Crane / lift hoisting service for rooftop delivery',
                    'On-site recipient sign-off & item inspection',
                    'GPS tracked dispatch across all regions of Morocco',
                ],
                'realization_steps' => [
                    ['step' => 1, 'key' => 'received', 'title' => 'Order Dispatched', 'desc' => 'Logistics request registered in store dispatch.'],
                    ['step' => 2, 'key' => 'review', 'title' => 'Warehouse Loading', 'desc' => 'Item manifest verification & secure strapping.'],
                    ['step' => 3, 'key' => 'assigned', 'title' => 'Truck Driver Dispatched', 'desc' => 'Logistics operator en route to destination.'],
                    ['step' => 4, 'key' => 'in_progress', 'title' => 'En Route to Site', 'desc' => 'Real-time GPS tracking active for customer delivery.'],
                    ['step' => 5, 'key' => 'completed', 'title' => 'Delivered & Signed', 'desc' => 'Delivery completed with client sign-off.'],
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($defaults as $row) {
            Service::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    ...$row,
                    'enabled' => true,
                    'creation_date' => now(),
                ]
            );
        }
    }
}
