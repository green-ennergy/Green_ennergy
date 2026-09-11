<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'product_key',
        'title',
        'category_id',
        'rating',
        'stock',
        'units_sold',
        'image',
        'description',
        'climate_info',
        'highlights',
        'specs',
        'documents',
        'unit_capacity',
        'unit_weight',
        'unit_area',
        'local_onee_cert',
        'related_ids',
    ];

    protected $casts = [
        'highlights' => 'array',
        'specs' => 'array',
        'documents' => 'array',
        'related_ids' => 'array',
        'local_onee_cert' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        if (str_starts_with($this->image, '/storage/')) {
            return rtrim(config('app.url'), '/') . $this->image;
        }

        if (str_starts_with($this->image, 'products/')) {
            return Storage::disk('public')->url($this->image);
        }

        return $this->image;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function rfqItems()
    {
        return $this->hasMany(RfqItem::class);
    }
}
