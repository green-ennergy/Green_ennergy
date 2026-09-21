<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Product;
use App\Models\Project;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $pendingStatuses = ['pending', 'review', 'engineering', 'issued'];
        $productCount = Product::count();
        $rfqCount = QuoteRequest::count();
        $projectCount = Project::count();
        $clientCount = Client::count();
        $pendingRfqs = QuoteRequest::whereIn('status', $pendingStatuses)->count();
        $lowStockCount = Product::where('stock', '<', 5)->count();

        $topProducts = DB::table('quote_items')
            ->select('id_product', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('id_product')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $productTitles = Product::whereIn('id_product', $topProducts->pluck('id_product'))
            ->get()
            ->keyBy('id_product');

        $demandByProduct = DB::table('quote_items')
            ->select('id_product', DB::raw('COUNT(*) as rfq_demand'))
            ->groupBy('id_product')
            ->pluck('rfq_demand', 'id_product');

        $lowInterest = Product::orderBy('sales')
            ->orderBy('title')
            ->limit(5)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id_product,
                'title' => $product->title,
                'rfq_demand' => (int) ($demandByProduct[$product->id_product] ?? 0),
            ]);

        $insights = [];
        if ($pendingRfqs > 0) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Quotes waiting',
                'message' => $pendingRfqs.' quote request'.($pendingRfqs === 1 ? '' : 's').' still need a reply.',
                'action' => 'orders',
            ];
        }
        if ($lowStockCount > 0) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Low stock',
                'message' => $lowStockCount.' catalog item'.($lowStockCount === 1 ? '' : 's').' are below 5 units.',
                'action' => 'marketplace',
            ];
        }
        if ($insights === []) {
            $insights[] = [
                'type' => 'info',
                'title' => 'All clear',
                'message' => 'No pending quotes or low-stock items right now.',
                'action' => 'overview',
            ];
        }

        return response()->json([
            'totals' => [
                'users' => $clientCount,
                'products' => $productCount,
                'rfqs' => $rfqCount,
                'projects' => $projectCount,
                'pending_rfqs' => $pendingRfqs,
                'low_stock_count' => $lowStockCount,
                'visits_today' => 0,
            ],
            'visit_stats' => [
                'week' => 0,
                'top_pages' => [],
            ],
            'low_interest_products' => $lowInterest,
            'top_products' => $topProducts->map(fn ($row) => [
                'product_id' => $row->id_product,
                'total_qty' => (int) $row->total_qty,
                'product' => [
                    'title' => $productTitles[$row->id_product]->title ?? null,
                ],
            ])->values(),
            'recent_rfqs' => QuoteRequest::orderByDesc('creation_date')
                ->limit(5)
                ->get()
                ->map(fn (QuoteRequest $quote) => [
                    'id' => $quote->id_quote,
                    'ticket_number' => $quote->number,
                    'company_name' => $quote->company,
                    'status' => $quote->status,
                ]),
            'insights' => $insights,
        ]);
    }
}
