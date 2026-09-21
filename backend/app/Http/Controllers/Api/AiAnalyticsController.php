<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use RuntimeException;
use Throwable;

class AiAnalyticsController extends Controller
{
    public function __construct(
        private readonly AiAnalyticsService $aiAnalytics,
    ) {}

    public function overview(): JsonResponse
    {
        try {
            return response()->json($this->aiAnalytics->overview());
        } catch (Throwable $e) {
            return $this->aiError($e);
        }
    }

    public function products(): JsonResponse
    {
        try {
            $overview = $this->aiAnalytics->overview();

            return response()->json($overview['products'] ?? []);
        } catch (Throwable $e) {
            return $this->aiError($e);
        }
    }

    public function showProduct(int $productId): JsonResponse
    {
        try {
            $overview = $this->aiAnalytics->overview();
            $product = collect($overview['products'] ?? [])
                ->firstWhere('id', $productId);

            if (! $product) {
                return response()->json(['message' => 'Product not found in AI analysis.'], 404);
            }

            return response()->json($product);
        } catch (Throwable $e) {
            return $this->aiError($e);
        }
    }

    public function trends(): JsonResponse
    {
        try {
            $overview = $this->aiAnalytics->overview();

            return response()->json($overview['trends'] ?? []);
        } catch (Throwable $e) {
            return $this->aiError($e);
        }
    }

    public function restockOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id_product'],
            'units' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            return response()->json(
                $this->aiAnalytics->restock($validated),
                201
            );
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Product not found.'], 404);
        } catch (Throwable $e) {
            return $this->aiError($e);
        }
    }

    private function aiError(Throwable $e): JsonResponse
    {
        $status = 502;
        if ($e instanceof RuntimeException && $e->getCode() >= 400 && $e->getCode() < 600) {
            $status = (int) $e->getCode();
        }

        return response()->json([
            'message' => $e->getMessage() ?: 'AI backend request failed.',
        ], $status === 0 ? 502 : $status);
    }
}
