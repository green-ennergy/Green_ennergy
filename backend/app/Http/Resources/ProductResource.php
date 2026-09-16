<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imagePaths = $this->normalizeImagePaths($this->image);
        $images = array_map(fn (string $path) => [
            'path' => $path,
            'url' => $this->publicUrl($path),
        ], $imagePaths);

        $primary = $images[0] ?? null;

        $documents = collect($this->decodeJsonField($this->documents) ?? [])
            ->map(function ($doc) {
                if (is_string($doc)) {
                    return [
                        'name' => $doc,
                        'path' => null,
                        'size' => null,
                        'url' => null,
                    ];
                }

                $path = $doc['path'] ?? null;

                return [
                    'name' => $doc['name'] ?? 'Document',
                    'path' => $path,
                    'size' => $doc['size'] ?? null,
                    'url' => $path ? $this->publicUrl($path) : ($doc['url'] ?? null),
                ];
            })
            ->values()
            ->all();

        return [
            'id' => $this->id_product,
            'product_key' => $this->reference,
            'title' => $this->title,
            'description' => $this->description,
            'stock' => (int) $this->stock,
            'rating' => $this->rating !== null ? (float) $this->rating : null,
            'units_sold' => (int) ($this->sales ?? 0),
            'rfq_demand' => (int) ($this->quotes_count ?? 0),
            'category_id' => $this->id_category,
            'category' => $this->whenLoaded('category', fn () => new CategoryResource($this->category)),
            'image' => $primary['path'] ?? null,
            'image_url' => $primary['url'] ?? null,
            'images' => $images,
            'is_visible' => (bool) ($this->is_visible ?? true),
            'climate_info' => $this->climate_info,
            'highlights' => $this->decodeJsonField($this->highlights),
            'specs' => $this->decodeJsonField($this->specs),
            'documents' => $documents,
            'unit_capacity' => $this->capacity,
            'unit_weight' => $this->weight_kg,
            'unit_area' => $this->surface,
        ];
    }

    private function normalizeImagePaths(mixed $image): array
    {
        if ($image === null || $image === '') {
            return [];
        }

        if (is_array($image)) {
            return array_values(array_filter($image));
        }

        if (is_string($image)) {
            $decoded = json_decode($image, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return array_values(array_filter($decoded));
            }

            return [$image];
        }

        return [];
    }

    private function publicUrl(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/storage/')) {
            return url($path);
        }

        return url(Storage::url($path));
    }

    private function decodeJsonField(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
        }

        return $value;
    }
}
