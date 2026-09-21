<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $table = 'services';

    protected $primaryKey = 'id_service';

    public $timestamps = false;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'category',
        'icon',
        'estimated_duration',
        'starting_price',
        'enabled',
        'bullets',
        'realization_steps',
        'sort_order',
        'creation_date',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'bullets' => 'array',
        'realization_steps' => 'array',
        'creation_date' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_service';
    }

    public function requests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'id_service', 'id_service');
    }
}
