<?php

namespace App\Support;

class MissionTypeData
{
    /**
     * Default field-workflow payload expected by the operator dashboard.
     *
     * @param  array<string, mixed>  $existing
     * @return array<string, mixed>
     */
    public static function forType(string $type, array $existing = []): array
    {
        $defaults = match ($type) {
            'installation' => self::installation(),
            'maintenance' => self::maintenance(),
            'delivery' => self::delivery(),
            'study' => self::study(),
            default => [],
        };

        return array_replace_recursive($defaults, $existing);
    }

    /**
     * @return array<string, mixed>
     */
    private static function installation(): array
    {
        return [
            'equipmentList' => [
                ['name' => 'Solar panels', 'qty' => 8, 'checked' => false],
                ['name' => 'Hybrid inverter', 'qty' => 1, 'checked' => false],
                ['name' => 'Mounting rails & clamps', 'qty' => 1, 'checked' => false],
                ['name' => 'DC/AC cabling kit', 'qty' => 1, 'checked' => false],
            ],
            'checklist' => [
                ['label' => 'Site safety briefing completed', 'done' => false],
                ['label' => 'Roof structure verified', 'done' => false],
                ['label' => 'Mounting system installed', 'done' => false],
                ['label' => 'Panels secured and connected', 'done' => false],
                ['label' => 'Inverter commissioned', 'done' => false],
                ['label' => 'Grounding & insulation tested', 'done' => false],
            ],
            'inverterSN' => '',
            'commissioningKW' => 0,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function maintenance(): array
    {
        return [
            'systemAge' => '—',
            'inverterModel' => '—',
            'systemCapacity' => '—',
            'lastServiceDate' => null,
            'reportedFault' => 'Routine inspection / fault diagnostics',
            'diagnosticsChecklist' => [
                ['label' => 'Visual inspection of panels & wiring', 'done' => false],
                ['label' => 'Inverter error logs reviewed', 'done' => false],
                ['label' => 'Performance vs expected yield checked', 'done' => false],
                ['label' => 'Connections tightened / cleaned', 'done' => false],
                ['label' => 'Client briefed on findings', 'done' => false],
            ],
            'replacedParts' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function delivery(): array
    {
        return [
            'orderNumber' => 'ORD-'.strtoupper(substr(uniqid(), -6)),
            'stagingBay' => 'Bay A',
            'items' => [
                ['sku' => 'PV-450W', 'name' => 'Solar Panel 450W', 'qty' => 4],
                ['sku' => 'ACC-KIT', 'name' => 'Accessories kit', 'qty' => 1],
            ],
            'deliverySteps' => [
                ['label' => 'Loaded at warehouse', 'done' => false],
                ['label' => 'En route to client', 'done' => false],
                ['label' => 'Arrived on site', 'done' => false],
                ['label' => 'Unloaded and verified with client', 'done' => false],
            ],
            'recipientName' => '',
            'recipientSignatureId' => null,
            'deliveryNotes' => '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function study(): array
    {
        return [
            'monthlyBillMAD' => 1200,
            'estimatedKWhMonthly' => 450,
            'roofAreaM2' => 40,
            'roofOrientation' => 'South (180°)',
            'roofTiltDeg' => 30,
            'shadingCondition' => 'low',
            'recommendedKWp' => 3.5,
            'estimatedYearlyKWh' => 5600,
            'estimatedMonthlySavingsMAD' => 780,
            'batteryNeeded' => false,
            'recommendedBatteryKWh' => 0,
            'paybackYears' => 6.5,
            'auditChecklist' => [
                ['label' => 'Roof accessibility confirmed', 'done' => false],
                ['label' => 'Electrical panel capacity checked', 'done' => false],
                ['label' => 'Shading survey completed', 'done' => false],
                ['label' => 'Consumption profile discussed with client', 'done' => false],
                ['label' => 'Preliminary sizing shared', 'done' => false],
            ],
        ];
    }
}
