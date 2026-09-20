<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteRequest extends Model
{
    protected $table = 'quote_requests';

    protected $primaryKey = 'id_quote';

    public $timestamps = false;

    protected $fillable = [
        'number', 'company', 'email', 'status', 'total_quantity', 'amount',
        'client_confirmed', 'stock_deducted', 'creation_date', 'id_admin',
        'id_project', 'id_client', 'origin',
    ];

    protected $casts = [
        'client_confirmed' => 'boolean',
        'stock_deducted' => 'boolean',
        'creation_date' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_quote';
    }

    public function administrator(): BelongsTo
    {
        return $this->belongsTo(Administrator::class, 'id_admin', 'id_admin');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'id_project', 'id_project');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client', 'id_client');
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class, 'id_quote', 'id_quote');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'quote_items', 'id_quote', 'id_product')
            ->withPivot('label', 'unit_price', 'line_type', 'quantity', 'locked');
    }
}
