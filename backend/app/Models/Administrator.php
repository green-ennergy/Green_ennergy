<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Administrator extends Model
{
    protected $table = 'administrators';

    protected $primaryKey = 'id_admin';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function kits(): HasMany
    {
        return $this->hasMany(Kit::class, 'id_admin', 'id_admin');
    }

    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class, 'id_admin', 'id_admin');
    }
}
