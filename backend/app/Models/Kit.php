<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kit extends Model
{
    protected $table = 'kits';

    protected $primaryKey = 'id_kit';

    public $timestamps = false;

    protected $fillable = [
        'name', 'description', 'status', 'creation_date', 'id_admin',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
    ];

    public function administrator(): BelongsTo
    {
        return $this->belongsTo(Administrator::class, 'id_admin', 'id_admin');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'kit_product', 'id_kit', 'id_product')
            ->withPivot('quantity', 'role', 'priority');
    }
}
