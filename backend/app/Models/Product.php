<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'id_product';

    public $timestamps = false;

    protected $fillable = [
        'reference', 'title', 'rating', 'stock', 'sales', 'image', 'description',
        'climate_info', 'highlights', 'specs', 'documents', 'capacity', 'weight_kg',
        'surface', 'id_category', 'is_visible',
    ];

    protected $casts = [
        'rating' => 'float',
        'capacity' => 'float',
        'weight_kg' => 'float',
        'surface' => 'float',
        'is_visible' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_product';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_category', 'id_category');
    }

    public function kits(): BelongsToMany
    {
        return $this->belongsToMany(Kit::class, 'kit_product', 'id_product', 'id_kit')
            ->withPivot('quantity', 'role', 'priority');
    }

    public function quotes(): BelongsToMany
    {
        return $this->belongsToMany(QuoteRequest::class, 'quote_items', 'id_product', 'id_quote')
            ->withPivot('label', 'unit_price', 'line_type', 'quantity', 'locked');
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_items', 'id_product', 'id_order')
            ->withPivot('quantity', 'unit_price');
    }

    public function aiStockAlerts(): HasMany
    {
        return $this->hasMany(AiStockAlert::class, 'id_product', 'id_product');
    }
}
