<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $table = 'clients';

    protected $primaryKey = 'id_client';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'id_client', 'id_client');
    }

    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class, 'id_client', 'id_client');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'id_client', 'id_client');
    }

    public function installations(): HasMany
    {
        return $this->hasMany(Installation::class, 'id_client', 'id_client');
    }
}
