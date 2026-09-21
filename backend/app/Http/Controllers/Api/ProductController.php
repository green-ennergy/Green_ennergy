<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $this->filteredQuery($request)
            ->with('category')
            ->withCount('quotes');

        if ($request->is('api/admin/*')) {
            if ($request->input('visibility') === 'visible') {
                $query->where('is_visible', true);
            } elseif ($request->input('visibility') === 'hidden') {
                $query->where('is_visible', false);
            }
        } else {
            $query->where('is_visible', true);
        }

        return ProductResource::collection($query->get());
    }

    public function show(Product $product): JsonResponse
    {
        if (! $product->is_visible) {
            abort(404, 'Product not found');
        }

        $product->load('category')->loadCount('quotes');

        return response()->json(
            (new ProductResource($product))->resolve()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateProduct($request);

        $product = new Product;
        $this->fillProduct($product, $validated, $request);
        $product->sales = 0;
        if (! array_key_exists('is_visible', $validated) && ! $request->has('is_visible')) {
            $product->is_visible = true;
        }
        $product->save();

        $product->load('category')->loadCount('quotes');

        return response()->json([
            'product' => new ProductResource($product),
        ], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $this->validateProduct($request, $product, partial: true);

        $this->fillProduct($product, $validated, $request);
        $product->save();

        $product->load('category')->loadCount('quotes');

        return response()->json([
            'product' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->deleteStoredFiles($this->normalizeImagePaths($product->image));

        foreach ($this->normalizeDocuments($product->documents) as $doc) {
            if (! empty($doc['path'])) {
                $this->deleteStoredFiles([$doc['path']]);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    private function filteredQuery(Request $request)
    {
        $query = Product::query();

        if ($search = $request->string('search')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categoryId = $request->input('category_id');
        if ($categoryId !== null && $categoryId !== '') {
            $query->where('id_category', $categoryId);
        }

        return match ($request->string('sort')->toString()) {
            'stock_asc' => $query->orderBy('stock'),
            'stock_desc' => $query->orderByDesc('stock'),
            'sales_desc' => $query->orderByDesc('sales'),
            'title' => $query->orderBy('title'),
            default => $query->orderByDesc('id_product'),
        };
    }

    private function validateProduct(Request $request, ?Product $product = null, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:50'],
            'category_id' => [$required, 'integer', Rule::exists('categories', 'id_category')],
            'stock' => [$partial ? 'sometimes' : 'required', 'integer', 'min:0', 'max:32767'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'description' => ['nullable', 'string', 'max:200'],
            'product_key' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products', 'reference')->ignore($product?->id_product, 'id_product'),
            ],
            'reference' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products', 'reference')->ignore($product?->id_product, 'id_product'),
            ],
            'image' => ['nullable', 'image', 'max:5120'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:5120'],
            'existing_images' => ['nullable', 'string'],
            'climate_info' => ['nullable', 'string', 'max:250'],
            'capacity' => ['nullable', 'numeric'],
            'weight_kg' => ['nullable', 'numeric'],
            'surface' => ['nullable', 'numeric'],
            'highlights' => ['nullable', 'string'],
            'specs' => ['nullable', 'string'],
            'existing_documents' => ['nullable', 'string'],
            'document_names' => ['nullable', 'array'],
            'document_names.*' => ['nullable', 'string', 'max:255'],
            'document_files' => ['nullable', 'array'],
            'document_files.*' => ['file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg,webp,txt,csv'],
            'is_visible' => ['sometimes', 'boolean'],
        ]);
    }

    private function fillProduct(Product $product, array $validated, Request $request): void
    {
        if (array_key_exists('title', $validated)) {
            $product->title = $validated['title'];
        }

        if (array_key_exists('category_id', $validated)) {
            $product->id_category = $validated['category_id'];
        }

        if (array_key_exists('stock', $validated)) {
            $product->stock = $validated['stock'];
        }

        if (array_key_exists('rating', $validated)) {
            $product->rating = $validated['rating'];
        }

        if (array_key_exists('description', $validated)) {
            $product->description = $validated['description'];
        }

        if (array_key_exists('climate_info', $validated)) {
            $product->climate_info = $validated['climate_info'];
        }

        if (array_key_exists('capacity', $validated)) {
            $product->capacity = $validated['capacity'];
        }

        if (array_key_exists('weight_kg', $validated)) {
            $product->weight_kg = $validated['weight_kg'];
        }

        if (array_key_exists('surface', $validated)) {
            $product->surface = $validated['surface'];
        }

        if ($request->has('is_visible')) {
            $product->is_visible = $request->boolean('is_visible');
        }

        foreach (['highlights', 'specs'] as $jsonField) {
            if (! array_key_exists($jsonField, $validated)) {
                continue;
            }

            $raw = $validated[$jsonField];
            if ($raw === null || $raw === '') {
                $product->{$jsonField} = null;

                continue;
            }

            $decoded = json_decode($raw, true);
            $product->{$jsonField} = json_last_error() === JSON_ERROR_NONE
                ? json_encode($decoded, JSON_UNESCAPED_UNICODE)
                : $raw;
        }

        $reference = $validated['product_key'] ?? $validated['reference'] ?? null;
        if ($reference) {
            $product->reference = $reference;
        } elseif (! $product->exists) {
            $product->reference = $this->generateReference($product->title ?? 'PRD');
        }

        $this->syncImages($product, $request, $validated);
        $this->syncDocuments($product, $request, $validated);
    }

    private function syncImages(Product $product, Request $request, array $validated): void
    {
        $hasExistingPayload = array_key_exists('existing_images', $validated);
        $hasNewFiles = $request->hasFile('images') || $request->hasFile('image');

        if (! $hasExistingPayload && ! $hasNewFiles) {
            return;
        }

        $currentPaths = $this->normalizeImagePaths($product->image);
        $keptPaths = $hasExistingPayload
            ? $this->decodeJsonArray($validated['existing_images'] ?? '[]')
            : $currentPaths;

        $keptPaths = array_values(array_filter($keptPaths, 'is_string'));

        $removed = array_diff($currentPaths, $keptPaths);
        $this->deleteStoredFiles($removed);

        $newPaths = [];
        foreach ($request->file('images', []) as $file) {
            if ($file instanceof UploadedFile) {
                $newPaths[] = $file->store('products', 'public');
            }
        }

        if ($request->hasFile('image')) {
            $newPaths[] = $request->file('image')->store('products', 'public');
        }

        $final = array_values(array_unique([...$keptPaths, ...$newPaths]));
        $product->image = $final === [] ? null : json_encode($final);
    }

    private function syncDocuments(Product $product, Request $request, array $validated): void
    {
        $hasExistingPayload = array_key_exists('existing_documents', $validated);
        $hasNewFiles = $request->hasFile('document_files');

        if (! $hasExistingPayload && ! $hasNewFiles) {
            return;
        }

        $currentDocs = $this->normalizeDocuments($product->documents);
        $keptDocs = $hasExistingPayload
            ? $this->normalizeDocuments($validated['existing_documents'] ?? '[]')
            : $currentDocs;

        $keptPaths = collect($keptDocs)->pluck('path')->filter()->all();
        $currentPaths = collect($currentDocs)->pluck('path')->filter()->all();
        $this->deleteStoredFiles(array_diff($currentPaths, $keptPaths));

        $names = $request->input('document_names', []);
        $files = $request->file('document_files', []);

        foreach ($files as $index => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store('products/documents', 'public');
            $name = trim((string) ($names[$index] ?? ''));
            if ($name === '') {
                $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            }

            $keptDocs[] = [
                'name' => $name,
                'path' => $path,
                'size' => $this->humanFileSize($file->getSize()),
            ];
        }

        $product->documents = $keptDocs === []
            ? null
            : json_encode(array_values($keptDocs), JSON_UNESCAPED_UNICODE);
    }

    private function generateReference(string $title): string
    {
        $base = Str::upper(Str::slug(Str::limit($title, 20, ''), '-')) ?: 'PRD';
        $base = Str::limit($base, 40, '');

        do {
            $reference = $base.'-'.Str::upper(Str::random(4));
        } while (Product::where('reference', $reference)->exists());

        return $reference;
    }

    private function normalizeImagePaths(mixed $image): array
    {
        if ($image === null || $image === '') {
            return [];
        }

        if (is_array($image)) {
            return array_values(array_filter($image, 'is_string'));
        }

        if (is_string($image)) {
            $decoded = json_decode($image, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return array_values(array_filter($decoded, 'is_string'));
            }

            return [$image];
        }

        return [];
    }

    private function normalizeDocuments(mixed $documents): array
    {
        if ($documents === null || $documents === '') {
            return [];
        }

        if (is_string($documents)) {
            $decoded = json_decode($documents, true);
            $documents = json_last_error() === JSON_ERROR_NONE ? $decoded : [];
        }

        if (! is_array($documents)) {
            return [];
        }

        return collect($documents)
            ->map(function ($doc) {
                if (is_string($doc)) {
                    return ['name' => $doc, 'path' => null, 'size' => null];
                }

                return [
                    'name' => $doc['name'] ?? 'Document',
                    'path' => $doc['path'] ?? null,
                    'size' => $doc['size'] ?? null,
                ];
            })
            ->values()
            ->all();
    }

    private function decodeJsonArray(?string $raw): array
    {
        if ($raw === null || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function deleteStoredFiles(array $paths): void
    {
        foreach ($paths as $path) {
            if (! is_string($path) || $path === '') {
                continue;
            }
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                continue;
            }
            Storage::disk('public')->delete($path);
        }
    }

    private function humanFileSize(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }
        if ($bytes < 1048576) {
            return round($bytes / 1024, 1).' KB';
        }

        return round($bytes / 1048576, 1).' MB';
    }
}
