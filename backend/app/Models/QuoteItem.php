<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteItem extends Model
{
    protected $table = 'quote_items';

    protected $primaryKey = 'id_item';

    public $timestamps = false;

    protected $fillable = [
        'id_quote',
        'id_product',
        'label',
        'unit_price',
        'line_type',
        'quantity',
        'locked',
    ];

    protected $casts = [
        'unit_price' => 'float',
        'quantity' => 'integer',
        'locked' => 'boolean',
    ];

    public function quote(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class, 'id_quote', 'id_quote');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }
}
