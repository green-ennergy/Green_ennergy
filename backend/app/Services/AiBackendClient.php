<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AiBackendClient
{
    /**
     * @param  list<array<string, mixed>>  $products
     * @return array<string, mixed>
     */
    public function analyze(array $products): array
    {
        return $this->post('/api/ai/analyze', ['products' => $products]);
    }

    public function overview(): array
    {
        return $this->get('/api/ai/overview');
    }

    public function products(): array
    {
        return $this->get('/api/ai/products');
    }

    public function product(int $productId): array
    {
        return $this->get("/api/ai/products/{$productId}");
    }

    public function trends(): array
    {
        return $this->get('/api/ai/trends');
    }

    /**
     * @param  array{product_id: int, units: int, notes?: string|null, product_name?: string|null}  $payload
     * @return array<string, mixed>
     */
    public function createRestockOrder(array $payload): array
    {
        return $this->post('/api/ai/restock-order', $payload);
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('services.ai_backend.url'), '/');
    }

    /**
     * @return array<string, mixed>
     */
    private function get(string $path): array
    {
        return $this->request('get', $path);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function post(string $path, array $payload): array
    {
        return $this->request('post', $path, $payload);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function request(string $method, string $path, array $payload = []): array
    {
        $url = $this->baseUrl().$path;

        try {
            $pending = Http::acceptJson()
                ->timeout((int) config('services.ai_backend.timeout', 15));

            $response = $method === 'post'
                ? $pending->post($url, $payload)
                : $pending->get($url);

            $response->throw();

            /** @var array<string, mixed> $data */
            $data = $response->json() ?? [];

            return $data;
        } catch (ConnectionException $e) {
            throw new RuntimeException('AI backend is unreachable.', 0, $e);
        } catch (RequestException $e) {
            $status = $e->response?->status() ?? 502;
            $message = $e->response?->json('detail')
                ?? $e->response?->json('message')
                ?? 'AI backend request failed.';

            throw new RuntimeException(is_string($message) ? $message : 'AI backend request failed.', $status, $e);
        }
    }
}
