<?php

namespace App\Services;

use App\Models\AiStockAlert;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class AiAnalyticsService
{
    public function __construct(
        private readonly AiBackendClient $aiBackend,
    ) {}

    /**
     * Build live catalog payload, ask FastAPI to analyze, persist alerts, return overview.
     *
     * @return array<string, mixed>
     */
    public function overview(): array
    {
        $catalog = $this->buildCatalogPayload();
        $overview = $this->aiBackend->analyze($catalog);
        $this->syncAlerts($overview['products'] ?? []);

        return $overview;
    }

    /**
     * @param  array{product_id: int, units: int, notes?: string|null}  $payload
     * @return array<string, mixed>
     */
    public function restock(array $payload): array
    {
        $product = Product::query()->findOrFail($payload['product_id']);
        $units = (int) $payload['units'];

        $aiResult = $this->aiBackend->createRestockOrder([
            'product_id' => $product->id_product,
            'units' => $units,
            'notes' => $payload['notes'] ?? null,
            'product_name' => $product->title,
        ]);

        $product->stock = (int) $product->stock + $units;
        $product->save();

        AiStockAlert::create([
            'risk_level' => 'restock_ordered',
            'analyzed_stock' => (int) $product->stock,
            'forecasted_sales' => 0,
            'quantity_to_order' => $units,
            'confidence' => 100,
            'reasons' => [
                $payload['notes'] ?? 'Bon de commande créé depuis le dashboard IA',
                'Stock mis à jour après commande',
            ],
            'analyzed_at' => now(),
            'id_product' => $product->id_product,
        ]);

        return array_merge($aiResult, [
            'product_id' => $product->id_product,
            'product_name' => $product->title,
            'units' => $units,
            'new_stock' => (int) $product->stock,
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function buildCatalogPayload(): array
    {
        $rfqDemand = DB::table('quote_items')
            ->select('id_product', DB::raw('COALESCE(SUM(quantity), 0) as rfq_demand'))
            ->groupBy('id_product')
            ->pluck('rfq_demand', 'id_product');

        return Product::query()
            ->with('category')
            ->orderBy('title')
            ->get()
            ->map(fn (Product $product) => [
                'id' => (int) $product->id_product,
                'name' => $product->title,
                'stock' => (int) $product->stock,
                'sales' => (int) $product->sales,
                'rfq_demand' => (int) ($rfqDemand[$product->id_product] ?? 0),
                'icon_type' => $this->iconType($product->category),
                'category' => $product->category?->slug,
            ])
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $products
     */
    private function syncAlerts(array $products): void
    {
        if ($products === []) {
            return;
        }

        $ids = collect($products)->pluck('id')->filter()->all();

        DB::transaction(function () use ($products, $ids) {
            AiStockAlert::query()
                ->whereIn('id_product', $ids)
                ->where('risk_level', '!=', 'restock_ordered')
                ->delete();

            foreach ($products as $row) {
                AiStockAlert::create([
                    'risk_level' => (string) ($row['risk'] ?? 'low'),
                    'analyzed_stock' => (int) ($row['stock'] ?? 0),
                    'forecasted_sales' => (int) ($row['expectedSales'] ?? 0),
                    'quantity_to_order' => (int) ($row['restock'] ?? 0),
                    'confidence' => (int) ($row['confidence'] ?? 0),
                    'reasons' => $row['reasons'] ?? [],
                    'analyzed_at' => now(),
                    'id_product' => (int) $row['id'],
                ]);
            }
        });
    }

    private function iconType(?Category $category): string
    {
        $slug = strtolower((string) ($category?->slug ?? $category?->name ?? ''));

        return match (true) {
            str_contains($slug, 'solar') || str_contains($slug, 'panel') => 'sun',
            str_contains($slug, 'batter') || str_contains($slug, 'storage') => 'battery',
            str_contains($slug, 'invert') => 'plug',
            default => 'zap',
        };
    }
}
