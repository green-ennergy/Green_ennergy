<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiStockAlert extends Model
{
    protected $table = 'ai_stock_alerts';

    protected $primaryKey = 'id_alert';

    public $timestamps = false;

    protected $fillable = [
        'risk_level', 'analyzed_stock', 'forecasted_sales', 'quantity_to_order',
        'confidence', 'reasons', 'analyzed_at', 'id_product',
    ];

    protected $casts = [
        'reasons' => 'array',
        'analyzed_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }
}
