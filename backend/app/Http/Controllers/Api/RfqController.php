<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Project;
use App\Models\QuoteItem;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RfqController extends Controller
{
    private const ADMIN_STATUSES = ['review', 'engineering', 'issued', 'dispatched'];

    private const CLIENT_STATUSES = ['cancelled'];

    private const LINE_TYPES = ['product', 'installation', 'service', 'transport', 'other'];

    public function index(Request $request): JsonResponse
    {
        $client = $request->user()->client;
        if (! $client) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $rfqs = QuoteRequest::query()
            ->with(['items.product', 'client.user'])
            ->where('id_client', $client->id_client)
            ->where(function ($query) {
                $query->whereNull('origin')->orWhere('origin', '!=', 'manual');
            })
            ->orderByDesc('creation_date')
            ->get()
            ->map(fn (QuoteRequest $quote) => $this->present($quote));

        return response()->json(['data' => $rfqs]);
    }

    public function store(Request $request): JsonResponse
    {
        $client = $request->user()->client;
        if (! $client) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id_product'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:32767'],
        ]);

        $this->assertItemsWithinStock($validated['items']);

        $user = $request->user()->loadMissing('client');

        $quote = DB::transaction(function () use ($validated, $client, $user) {
            $merged = [];
            foreach ($validated['items'] as $item) {
                $productId = (int) $item['product_id'];
                $merged[$productId] = ($merged[$productId] ?? 0) + (int) $item['quantity'];
            }

            $products = Product::query()
                ->whereIn('id_product', array_keys($merged))
                ->get()
                ->keyBy('id_product');

            $quote = QuoteRequest::create([
                'number' => $this->nextTicketNumber(),
                'company' => $user->company,
                'email' => $user->email,
                'status' => 'review',
                'total_quantity' => array_sum($merged),
                'amount' => 0,
                'client_confirmed' => false,
                'stock_deducted' => false,
                'creation_date' => now(),
                'id_client' => $client->id_client,
                'origin' => 'store',
            ]);

            foreach ($merged as $productId => $quantity) {
                $product = $products->get($productId);
                QuoteItem::create([
                    'id_quote' => $quote->id_quote,
                    'id_product' => $productId,
                    'label' => Str::limit($product?->title ?? 'Product', 50, ''),
                    'unit_price' => 0,
                    'line_type' => 'product',
                    'quantity' => $quantity,
                    'locked' => false,
                ]);
            }

            return $quote->load(['items.product', 'client.user']);
        });

        return response()->json([
            'rfq' => $this->present($quote),
            'message' => 'RFQ submitted successfully',
        ], 201);
    }

    public function updateStatus(Request $request, QuoteRequest $rfq): JsonResponse
    {
        $this->assertClientOwns($request, $rfq);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(self::CLIENT_STATUSES)],
        ]);

        if ($rfq->client_confirmed) {
            throw ValidationException::withMessages([
                'status' => ['Confirmed quotes cannot be cancelled.'],
            ]);
        }

        if (! in_array($this->normalizeStatus($rfq->status), ['review', 'pending', 'engineering'], true)) {
            throw ValidationException::withMessages([
                'status' => ['This quote can no longer be cancelled.'],
            ]);
        }

        $rfq->update(['status' => $validated['status']]);

        return response()->json([
            'rfq' => $this->present($rfq->fresh(['items.product', 'client.user'])),
        ]);
    }

    public function confirm(Request $request, QuoteRequest $rfq): JsonResponse
    {
        $this->assertClientOwns($request, $rfq);

        if ($rfq->client_confirmed && $rfq->id_project) {
            $rfq->load(['items.product', 'client.user', 'project']);

            return response()->json([
                'rfq' => $this->present($rfq),
                'project' => [
                    'id' => $rfq->id_project,
                    'name' => $rfq->project?->name,
                    'status' => $rfq->project?->status,
                ],
                'message' => 'Quote already confirmed',
            ]);
        }

        $status = $this->normalizeStatus($rfq->status);
        if (! in_array($status, ['issued', 'engineering'], true) && (float) $rfq->amount <= 0) {
            throw ValidationException::withMessages([
                'rfq' => ['Quote is not ready to confirm yet.'],
            ]);
        }

        if ((float) $rfq->amount <= 0) {
            throw ValidationException::withMessages([
                'rfq' => ['Quote has no priced total yet.'],
            ]);
        }

        $result = DB::transaction(function () use ($rfq) {
            $rfq->load(['items.product', 'client.user']);

            if (! $rfq->stock_deducted) {
                $this->assertQuoteWithinStock($rfq);
                $this->deductStock($rfq);
            }

            $project = Project::create([
                'name' => trim(($rfq->company ?: 'Client').' — '.$rfq->number),
                'id_client' => $rfq->id_client,
                'status' => 'quote_confirmed',
                'progress' => 25,
                'completed_steps' => ['quote_confirmed'],
                'start_date' => now()->toDateString(),
                'description' => 'Created from RFQ '.$rfq->number,
            ]);

            $rfq->update([
                'client_confirmed' => true,
                'stock_deducted' => true,
                'status' => 'dispatched',
                'id_project' => $project->id_project,
            ]);

            return [
                'rfq' => $rfq->fresh(['items.product', 'client.user']),
                'project' => $project,
            ];
        });

        return response()->json([
            'rfq' => $this->present($result['rfq']),
            'project' => [
                'id' => $result['project']->id_project,
                'name' => $result['project']->name,
                'status' => $result['project']->status,
            ],
            'message' => 'Quote confirmed',
        ]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->query('status');

        $query = QuoteRequest::query()
            ->with(['items.product', 'client.user'])
            ->where(function ($q) {
                $q->whereNull('origin')->orWhere('origin', '!=', 'manual');
            })
            ->when(
                $status === 'review',
                fn ($q) => $q->whereIn('status', ['review', 'pending']),
                fn ($q) => $status ? $q->where('status', $status) : $q
            )
            ->orderByDesc('creation_date');

        $rfqs = $query->get()->map(fn (QuoteRequest $quote) => $this->present($quote));

        return response()->json(['data' => $rfqs]);
    }

    public function adminUpdateStatus(Request $request, QuoteRequest $rfq): JsonResponse
    {
        $this->assertNotManual($rfq);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(self::ADMIN_STATUSES)],
        ]);

        $rfq->update(['status' => $validated['status']]);

        return response()->json([
            'rfq' => $this->present($rfq->fresh(['items.product', 'client.user'])),
        ]);
    }

    public function adminQuote(Request $request, QuoteRequest $rfq): JsonResponse
    {
        $this->assertNotManual($rfq);

        if ($rfq->client_confirmed) {
            throw ValidationException::withMessages([
                'rfq' => ['Confirmed quotes cannot be edited.'],
            ]);
        }

        $validated = $request->validate([
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.id' => ['nullable', 'integer'],
            'lines.*.label' => ['nullable', 'string', 'max:50'],
            'lines.*.quantity' => ['required', 'integer', 'min:1', 'max:32767'],
            'lines.*.unit_price' => ['required', 'numeric', 'min:0.01'],
            'lines.*.item_type' => ['nullable', 'string', Rule::in(self::LINE_TYPES)],
            'remove_ids' => ['nullable', 'array'],
            'remove_ids.*' => ['integer'],
        ]);

        $adminId = $request->user()->administrator?->id_admin;

        $quote = DB::transaction(function () use ($validated, $rfq, $adminId) {
            $rfq->load('items');

            $removeIds = array_map('intval', $validated['remove_ids'] ?? []);
            if ($removeIds !== []) {
                QuoteItem::query()
                    ->where('id_quote', $rfq->id_quote)
                    ->whereIn('id_item', $removeIds)
                    ->whereNull('id_product')
                    ->delete();
            }

            $catalogByProduct = $rfq->items
                ->filter(fn (QuoteItem $item) => $item->id_product)
                ->keyBy('id_product');

            $manualById = $rfq->items
                ->filter(fn (QuoteItem $item) => ! $item->id_product)
                ->keyBy('id_item');

            foreach ($validated['lines'] as $line) {
                $lineId = isset($line['id']) ? (int) $line['id'] : null;
                $type = $line['item_type'] ?? 'other';
                $label = Str::limit(trim((string) ($line['label'] ?? '')), 50, '') ?: null;
                $quantity = (int) $line['quantity'];
                $unitPrice = round((float) $line['unit_price'], 2);

                // Catalog line: id refers to product_id
                if ($lineId && $catalogByProduct->has($lineId)) {
                    $item = $catalogByProduct->get($lineId);
                    if ($item->locked) {
                        continue;
                    }
                    $item->update([
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'label' => $label ?: $item->label,
                        'line_type' => 'product',
                    ]);

                    continue;
                }

                // Existing manual line: id refers to id_item
                if ($lineId && $manualById->has($lineId)) {
                    $manualById->get($lineId)->update([
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'label' => $label ?: 'Line item',
                        'line_type' => $type,
                    ]);

                    continue;
                }

                // New catalog product added during quoting
                if ($lineId && Product::where('id_product', $lineId)->exists() && $type === 'product') {
                    $product = Product::find($lineId);
                    QuoteItem::create([
                        'id_quote' => $rfq->id_quote,
                        'id_product' => $lineId,
                        'label' => $label ?: Str::limit($product?->title ?? 'Product', 50, ''),
                        'unit_price' => $unitPrice,
                        'line_type' => 'product',
                        'quantity' => $quantity,
                        'locked' => false,
                    ]);

                    continue;
                }

                // New manual line
                QuoteItem::create([
                    'id_quote' => $rfq->id_quote,
                    'id_product' => null,
                    'label' => $label ?: 'Line item',
                    'unit_price' => $unitPrice,
                    'line_type' => $type,
                    'quantity' => $quantity,
                    'locked' => false,
                ]);
            }

            $rfq->unsetRelation('items');
            $rfq->load('items');

            $totalQty = (int) $rfq->items->sum('quantity');
            $amount = round((float) $rfq->items->sum(
                fn (QuoteItem $item) => $item->quantity * $item->unit_price
            ), 2);

            $rfq->update([
                'total_quantity' => $totalQty,
                'amount' => $amount,
                'status' => 'issued',
                'id_admin' => $adminId ?? $rfq->id_admin,
            ]);

            return $rfq->fresh(['items.product', 'client.user']);
        });

        return response()->json([
            'rfq' => $this->present($quote),
            'message' => 'Quote sent',
        ]);
    }

    private function present(QuoteRequest $quote): array
    {
        $quote->loadMissing(['items.product', 'client.user']);

        $status = $this->normalizeStatus($quote->status);
        $hasQuote = (float) $quote->amount > 0 || $status === 'issued' || $status === 'dispatched';

        $items = $quote->items->map(function (QuoteItem $item) use ($hasQuote) {
            $productId = $item->id_product ? (int) $item->id_product : null;
            $displayName = trim((string) ($item->label ?: $item->product?->title ?: 'Line item'));
            $unitPrice = (float) $item->unit_price;
            $quantity = (int) $item->quantity;

            return [
                'id' => $productId ?: (int) $item->id_item,
                'product_id' => $productId,
                'display_name' => $displayName,
                'quantity' => $quantity,
                'unit_price' => ($hasQuote && $unitPrice > 0) ? $unitPrice : ($unitPrice > 0 ? $unitPrice : null),
                'item_type' => $item->line_type ?: ($productId ? 'product' : 'other'),
                'line_total' => ($unitPrice > 0) ? round($unitPrice * $quantity, 2) : null,
                'locked' => (bool) $item->locked,
            ];
        })->values()->all();

        return [
            'id' => $quote->id_quote,
            'ticket_number' => $quote->number,
            'company_name' => $quote->company,
            'company' => $quote->company,
            'email' => $quote->email,
            'status' => $status,
            'quoted_total' => $hasQuote ? (float) $quote->amount : null,
            'amount' => (float) $quote->amount,
            'client_confirmed' => (bool) $quote->client_confirmed,
            'stock_deducted' => (bool) $quote->stock_deducted,
            'created_at' => optional($quote->creation_date)?->toIso8601String(),
            'id_project' => $quote->id_project,
            'id_client' => $quote->id_client,
            'user' => [
                'phone' => $quote->client?->user?->phone,
                'name' => $quote->client?->user?->name,
            ],
            'items' => $items,
        ];
    }

    private function normalizeStatus(?string $status): string
    {
        if ($status === 'pending') {
            return 'review';
        }

        return $status ?: 'review';
    }

    private function nextTicketNumber(): string
    {
        do {
            $number = 'RFQ-'.now()->format('Y').'-'.Str::upper(Str::random(5));
        } while (QuoteRequest::where('number', $number)->exists());

        return $number;
    }

    private function assertClientOwns(Request $request, QuoteRequest $rfq): void
    {
        $client = $request->user()->client;
        if (! $client || (int) $rfq->id_client !== (int) $client->id_client) {
            abort(403, 'Unauthorized.');
        }

        $this->assertNotManual($rfq);
    }

    private function assertNotManual(QuoteRequest $rfq): void
    {
        if ($rfq->origin === 'manual') {
            abort(404);
        }
    }

    private function assertItemsWithinStock(array $items): void
    {
        $merged = [];
        foreach ($items as $index => $item) {
            $id = (int) $item['product_id'];
            $merged[$id] = ($merged[$id] ?? 0) + (int) $item['quantity'];
        }

        $stocks = Product::query()
            ->whereIn('id_product', array_keys($merged))
            ->pluck('stock', 'id_product');

        $errors = [];
        foreach ($items as $index => $item) {
            $id = (int) $item['product_id'];
            $qty = (int) $item['quantity'];
            $stock = (int) ($stocks[$id] ?? 0);
            $needed = $merged[$id];

            if ($stock <= 0) {
                $errors["items.$index.quantity"] = ['This product is out of stock.'];
            } elseif ($needed > $stock) {
                $errors["items.$index.quantity"] = ["Quantity cannot exceed available stock ($stock)."];
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    private function assertQuoteWithinStock(QuoteRequest $rfq): void
    {
        $errors = [];
        foreach ($rfq->items as $index => $item) {
            if (! $item->id_product) {
                continue;
            }
            $stock = (int) ($item->product?->stock ?? 0);
            $qty = (int) $item->quantity;
            if ($stock < $qty) {
                $errors["items.$index.quantity"] = ["Insufficient stock for {$item->label} (available: $stock)."];
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    private function deductStock(QuoteRequest $rfq): void
    {
        foreach ($rfq->items as $item) {
            if (! $item->id_product) {
                continue;
            }
            Product::where('id_product', $item->id_product)
                ->where('stock', '>=', $item->quantity)
                ->decrement('stock', $item->quantity);
        }
    }
}
