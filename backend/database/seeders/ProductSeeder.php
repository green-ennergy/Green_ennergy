<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Solar Panel', 'slug' => 'panels'],
            ['name' => 'Inverter', 'slug' => 'inverters'],
            ['name' => 'Battery Storage', 'slug' => 'storage'],
            ['name' => 'EV Charger', 'slug' => 'chargers'],
            ['name' => 'Wind Turbine', 'slug' => 'wind'],
        ];

        $categoryMap = [];
        foreach ($categories as $cat) {
            $category = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
            $categoryMap[$cat['slug']] = $category->id;
        }

        // Products data
        $products = [
            [
                'product_key' => 'atlas-panel',
                'title' => 'Atlas Bifacial 550W Panel',
                'category_id' => $categoryMap['panels'],
                'rating' => 4.9,
                'stock' => 14,
                'image' => '/store_panel_1779052677623.png',
                'description' => 'The Atlas Bifacial 550W is a high-performance double-glass solar panel built with state-of-the-art N-Type tunnel oxide passivated contact (TOPCon) technology. By utilizing bifacial power generation, it harvests reflected light from both sides, increasing output on bright sands and gravel rooftops.',
                'climate_info' => 'Engineered specifically for the dry heat and high-radiation conditions of Morocco. Features a low temperature coefficient that prevents power degradation during Marrakech summers, and premium sand-abrasion-resistant anti-reflective glass layers that withstand Sahara dust storms.',
                'highlights' => [
                    'Rated Output' => '550 Wp',
                    'Bifaciality' => 'Up to 80%',
                    'Module Efficiency' => '21.5%',
                    'Product Warranty' => '15 Years',
                ],
                'specs' => [
                    'Cell Type' => 'N-Type TOPCon Monocrystalline',
                    'Dimensions' => '2278 x 1134 x 35 mm',
                    'Weight' => '32.5 kg',
                    'Maximum System Voltage' => '1500 V DC',
                    'Front Glass' => '2.0 mm Semi-tempered Glass',
                    'Back Glass' => '2.0 mm Semi-tempered Glass',
                    'Junction Box' => 'IP68 rating with bypass diodes',
                    'Wind / Snow Load Capacity' => '2400 Pa / 5400 Pa',
                ],
                'documents' => [
                    ['name' => 'Atlas 550W Tech Datasheet', 'size' => '2.4 MB'],
                    ['name' => 'Installation & Mounting Manual', 'size' => '4.1 MB'],
                    ['name' => 'Moroccan Grid Compliance Guidelines', 'size' => '1.8 MB'],
                ],
                'unit_capacity' => 0.55,
                'unit_weight' => 32.5,
                'unit_area' => 2.58,
                'local_onee_cert' => true,
                'related_ids' => ['toubkal-inverter', 'sahara-battery'],
            ],
            [
                'product_key' => 'atlas-panel-utility',
                'title' => 'Atlas Bifacial 670W Ultra Max',
                'category_id' => $categoryMap['panels'],
                'rating' => 5.0,
                'stock' => 25,
                'image' => '/store_panel_670w.png',
                'description' => 'Designed for utility-scale solar farms and massive commercial roofs. The Atlas Ultra Max 670W features 210mm silicon wafers and high-density packaging technology, achieving record-breaking energy density per square meter and reducing overall racking cost.',
                'climate_info' => 'Equipped with enhanced composite frame materials to prevent corrosion in high-humidity coastal deployments (Tarfaya, Laayoune). Multi-busbar (MBB) cell design ensures uniform current flow, minimizing hot spots in high-irradiance desert zones.',
                'highlights' => [
                    'Rated Output' => '670 Wp',
                    'Bifaciality' => 'Up to 85%',
                    'Module Efficiency' => '22.1%',
                    'Product Warranty' => '12 Years',
                ],
                'specs' => [
                    'Cell Type' => 'N-Type Monocrystalline G12',
                    'Dimensions' => '2384 x 1303 x 35 mm',
                    'Weight' => '38.7 kg',
                    'Maximum System Voltage' => '1500 V DC',
                    'Front Glass' => '2.0 mm High Transmission Glass',
                    'Back Glass' => '2.0 mm Heat Strengthened Glass',
                    'Junction Box' => 'IP68 with 3 bypass diodes',
                    'Certifications' => 'CE, TUV',
                ],
                'documents' => [
                    ['name' => 'Atlas Ultra Max 670W Spec Sheet', 'size' => '3.1 MB'],
                    ['name' => 'Utility Mounting Systems Guide', 'size' => '5.2 MB'],
                    ['name' => 'High-Voltage Grid Interconnect Log', 'size' => '2.2 MB'],
                ],
                'unit_capacity' => 0.67,
                'unit_weight' => 38.7,
                'unit_area' => 3.11,
                'local_onee_cert' => true,
                'related_ids' => ['toubkal-inverter-com', 'sahara-container'],
            ],
            [
                'product_key' => 'toubkal-inverter',
                'title' => 'Toubkal Smart Inverter 10kW',
                'category_id' => $categoryMap['inverters'],
                'rating' => 4.8,
                'stock' => 5,
                'image' => '/store_inverter_1779052696214.png',
                'description' => 'Smart 3-phase hybrid inverter with built-in thermal cooling to withstand intense heat. Includes direct cloud solar monitoring interface and manages simultaneous inputs from solar arrays, battery storage banks, and the national grid.',
                'climate_info' => 'Advanced passive cooling heatsink system allows operating under harsh ambient conditions up to 55°C without thermal derating. Completely enclosed IP66 casing protects internal microprocessors from salt spray on coastal cities (Casablanca, Rabat, Tangier) and fine sand ingress.',
                'highlights' => [
                    'Nominal AC Power' => '10,000 Watts',
                    'MPPT Range' => '140V - 1000V',
                    'Max Efficiency' => '98.2%',
                    'Product Warranty' => '10 Years',
                ],
                'specs' => [
                    'Phase Support' => 'Three-Phase',
                    'Number of MPPT Trackers' => '2',
                    'Max Input DC Current' => '15A per MPPT',
                    'Battery Chemistry Compatibility' => 'LiFePO4 (LFP) / Lead-Acid',
                    'Dimensions' => '515 x 370 x 225 mm',
                    'Cooling Mechanism' => 'Smart Intelligent Fan Cooling',
                    'Communication Interface' => 'Wi-Fi / Ethernet / RS485 / GPRS',
                    'Protection Features' => 'DC reverse polarity, AC short circuit, Anti-islanding',
                ],
                'documents' => [
                    ['name' => 'Toubkal Inverter Pro Specifications', 'size' => '3.1 MB'],
                    ['name' => 'App Setup & Cloud Telemetry Manual', 'size' => '2.8 MB'],
                    ['name' => 'CE Certification Framework', 'size' => '1.2 MB'],
                ],
                'unit_capacity' => 10,
                'unit_weight' => 26,
                'unit_area' => 0.12,
                'local_onee_cert' => true,
                'related_ids' => ['atlas-panel', 'sahara-battery'],
            ],
            [
                'product_key' => 'toubkal-inverter-com',
                'title' => 'Toubkal Commercial Inverter 100kW',
                'category_id' => $categoryMap['inverters'],
                'rating' => 4.9,
                'stock' => 8,
                'image' => '/store_inverter_100kw.png',
                'description' => 'The ultimate power unit for commercial and industrial solar grids. Features 9 independent MPPT trackers to completely eliminate solar mismatch losses due to architectural shadows, rooftop obstacles, or dynamic local shading.',
                'climate_info' => 'Forced air smart cooling architecture optimized to keep internal IGBT junctions cool during intense peak hours in places like Ouarzazate or Erfoud. Smart string monitoring and I-V curve diagnosis detect issues before they impact productivity.',
                'highlights' => [
                    'Nominal AC Power' => '100,000 Watts',
                    'MPPT Trackers' => '9 Trackers',
                    'Max Efficiency' => '98.9%',
                    'Product Warranty' => '5 Years',
                ],
                'specs' => [
                    'Phase Support' => 'Three-Phase',
                    'Max Input Voltage' => '1100 V',
                    'Rated Output Voltage' => '400 V / 480 V AC',
                    'Max Output Current' => '160 A',
                    'Ingress Protection' => 'IP66 Industrial Dust & Water',
                    'Cooling' => 'Smart forced-air active cooling',
                    'Grid Regulation' => 'Low & Medium Voltage Compliance',
                    'Safety Standards' => 'IEC 62109-1/2, VDE-AR-N 4105',
                ],
                'documents' => [
                    ['name' => 'Toubkal 100kW Engineering Spec Guide', 'size' => '4.8 MB'],
                    ['name' => 'Commercial Grid Interconnection Manual', 'size' => '6.1 MB'],
                ],
                'unit_capacity' => 100,
                'unit_weight' => 84,
                'unit_area' => 0.35,
                'local_onee_cert' => true,
                'related_ids' => ['atlas-panel-utility', 'sahara-container'],
            ],
            [
                'product_key' => 'sahara-battery',
                'title' => 'Sahara Lithium Reserve 15kWh',
                'category_id' => $categoryMap['storage'],
                'rating' => 5.0,
                'stock' => 2,
                'image' => '/store_battery_1779052715393.png',
                'description' => 'Premium ultra-safe Lithium Iron Phosphate (LFP) energy cell with intelligent liquid cooling, designed for maximum longevity. Perfect for storing solar energy to use during Peak Hours or grid outages.',
                'climate_info' => 'Comes with active automated thermal management systems that adjust cooling cycles dynamically based on exterior temperatures, preventing cell swelling or thermal runaway. Optimized for Moroccan high-ambient homes and agricultural installations.',
                'highlights' => [
                    'Storage Capacity' => '15 kWh usable',
                    'Cell Chemistry' => 'LiFePO4 (LFP)',
                    'Cycle Life' => '6,000 Cycles (90% DoD)',
                    'Product Warranty' => '10 Years',
                ],
                'specs' => [
                    'Nominal Battery Voltage' => '51.2 V',
                    'Continuous Charge Current' => '150 A',
                    'Continuous Discharge Current' => '150 A',
                    'Dimensions' => '980 x 650 x 240 mm',
                    'Weight' => '142 kg',
                    'Protection Standard' => 'IP65 Dustproof',
                    'Certifications' => 'IEC 62619, CE, UN38.3',
                    'Expandability' => 'Parallel link up to 4 battery modules',
                ],
                'documents' => [
                    ['name' => 'Sahara LFP Storage Datasheet', 'size' => '1.9 MB'],
                    ['name' => 'BMS Safety & Programming Manual', 'size' => '3.5 MB'],
                ],
                'unit_capacity' => 15,
                'unit_weight' => 142,
                'unit_area' => 0.24,
                'local_onee_cert' => true,
                'related_ids' => ['atlas-panel', 'toubkal-inverter'],
            ],
            [
                'product_key' => 'sahara-container',
                'title' => 'Sahara Industrial PowerVault 100kWh',
                'category_id' => $categoryMap['storage'],
                'rating' => 5.0,
                'stock' => 3,
                'image' => '/store_battery_100kwh.png',
                'description' => 'High-density, commercial-grade energy storage battery cabinet designed for heavy industrial peak-shaving, smart grid ancillary support, and agricultural solar pumping systems. Integrates dynamic cell balance monitoring.',
                'climate_info' => 'Double-walled thermal cabinet enclosure with professional HVAC refrigeration cooling. Complete dust sealing handles sandy Sahara winds while preventing thermal pockets in sub-Saharan Moroccan conditions.',
                'highlights' => [
                    'Storage Capacity' => '100 kWh usable',
                    'Cell Chemistry' => 'LiFePO4 (LFP) Grade-A',
                    'Cycle Life' => '8,000 Cycles (85% DoD)',
                    'Product Warranty' => '10 Years',
                ],
                'specs' => [
                    'System Voltage' => '768 V DC',
                    'Max Charge / Discharge' => '100 kW / 100 kW',
                    'HVAC Cooling Power' => '1.8 kW active refrigerating',
                    'BMS Connectivity' => 'Modbus TCP / CAN / RS485',
                    'Dimensions' => '1850 x 1100 x 950 mm',
                    'Weight' => '980 kg',
                    'Enclosure Security' => 'Automatic Aerosol Fire Suppression built-in',
                    'Seismic Standard' => 'IEEE 693 compliance',
                ],
                'documents' => [
                    ['name' => 'Sahara PowerVault 100kWh Spec Book', 'size' => '6.4 MB'],
                    ['name' => 'Fire Suppression & HVAC Maintenance Log', 'size' => '3.9 MB'],
                ],
                'unit_capacity' => 100,
                'unit_weight' => 980,
                'unit_area' => 1.05,
                'local_onee_cert' => true,
                'related_ids' => ['toubkal-inverter-com', 'atlas-panel-utility'],
            ],
            [
                'product_key' => 'oasis-charger',
                'title' => 'Oasis EV Charger 22kW',
                'category_id' => $categoryMap['chargers'],
                'rating' => 4.7,
                'stock' => 6,
                'image' => '/store_charger_1779052734307.png',
                'description' => 'Intelligent electric vehicle charger that synchronizes directly with solar production. Sleek anti-dust glass front casing and intelligent current adjustments to match charging speeds directly to active solar generation curves.',
                'climate_info' => 'Equipped with a solid anti-UV glass front face that resists color fade and sun cracking under intense sun exposure. Internal relays are protected by professional Moroccan dustproof certifications, making it perfect for riad garages or desert parking lots.',
                'highlights' => [
                    'Maximum Output' => '22 kW AC',
                    'Connector Type' => 'Type 2 Tethered',
                    'Cable Length' => '5 Meters',
                    'Product Warranty' => '5 Years',
                ],
                'specs' => [
                    'Input Voltage' => '400V AC (3-Phase)',
                    'Charging Current Range' => '6A - 32A',
                    'RFID Authorization' => 'Yes (Built-in)',
                    'Dimensions' => '360 x 250 x 115 mm',
                    'Weight' => '6.2 kg',
                    'Enclosure Rating' => 'IK10 Impact / IP54 Splash',
                    'Smart App Connectivity' => 'Yes (Wi-Fi / Bluetooth / App control)',
                    'Mounting Hardware' => 'Wall bracket / Stand post compatible',
                ],
                'documents' => [
                    ['name' => 'Oasis EV Charger Installation Manual', 'size' => '2.2 MB'],
                    ['name' => 'Smart Solar Sync Programming Layout', 'size' => '1.5 MB'],
                ],
                'unit_capacity' => 22,
                'unit_weight' => 6.2,
                'unit_area' => 0.09,
                'local_onee_cert' => false,
                'related_ids' => ['atlas-panel', 'toubkal-inverter'],
            ],
            [
                'product_key' => 'ares-wind-turbine',
                'title' => 'Ares Coastal Wind Turbine 5kW',
                'category_id' => $categoryMap['wind'],
                'rating' => 4.6,
                'stock' => 3,
                'image' => '/store_wind_5kw.png',
                'description' => 'Horizontal-axis wind turbine optimized for low-to-medium wind speeds. An exceptional clean energy addition for Moroccan coastal sites (Dakhla, Essaouira, Tangier) experiencing constant high marine wind streams.',
                'climate_info' => 'Constructed using aerospace-grade carbon fiber blades and double anti-corrosion galvanized paint structure. Anti-typhoon electromagnetic braking system protects the system from damage during violent storms.',
                'highlights' => [
                    'Rated Output' => '5,000 Watts',
                    'Start-up Wind Speed' => '2.0 m/s',
                    'Rotor Diameter' => '3.2 Meters',
                    'Product Warranty' => '5 Years',
                ],
                'specs' => [
                    'Generator Type' => 'Permanent Magnet 3-Phase AC',
                    'Rated Wind Speed' => '11 m/s',
                    'Survival Wind Speed' => '50 m/s',
                    'Output Voltage' => '380 V AC (Hybrid system compatible)',
                    'Tower Height Recommended' => '9m to 12m pole',
                    'Weight' => '186 kg',
                    'Braking System' => 'Electromagnetic + Mechanical yawing control',
                    'Noise Level' => 'Under 48dB at 5m/s wind speed',
                ],
                'documents' => [
                    ['name' => 'Ares 5kW Wind Turbine Technical Data', 'size' => '3.5 MB'],
                    ['name' => 'Tower Construction & Concrete Specs', 'size' => '5.1 MB'],
                ],
                'unit_capacity' => 5,
                'unit_weight' => 186,
                'unit_area' => 8.0,
                'local_onee_cert' => false,
                'related_ids' => ['toubkal-inverter', 'sahara-battery'],
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['product_key' => $product['product_key']],
                $product
            );
        }
    }
}
