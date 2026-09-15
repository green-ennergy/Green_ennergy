<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    protected $table = 'orders';

    protected $primaryKey = 'id_order';

    public $timestamps = false;

    protected $fillable = [
        'number', 'status', 'amount', 'creation_date', 'id_client',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client', 'id_client');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items', 'id_order', 'id_product')
            ->withPivot('quantity', 'unit_price');
    }
}
