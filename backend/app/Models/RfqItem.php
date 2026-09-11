<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class RfqItem extends Model
{
    protected $table = 'rfq_items';

    protected $fillable = [
        'rfq_ticket_id',
        'product_id',
        'label',
        'item_type',
        'quantity',
        'unit_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
    ];

    protected $appends = ['display_name', 'line_total'];

    public function rfqTicket()
    {
        return $this->belongsTo(RfqTicket::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected function displayName(): Attribute
    {
        return Attribute::get(fn () => $this->product?->title ?? $this->label ?? 'Line item');
    }

    protected function lineTotal(): Attribute
    {
        return Attribute::get(function () {
            if ($this->unit_price === null) {
                return null;
            }

            return round((float) $this->unit_price * (int) $this->quantity, 2);
        });
    }

    public function isCatalogProduct(): bool
    {
        return $this->product_id !== null;
    }
}
