<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'categories';

    protected $primaryKey = 'id_category';

    public $timestamps = false;

    protected $fillable = [
        'name', 'slug', 'description',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_category';
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_category', 'id_category');
    }
}
