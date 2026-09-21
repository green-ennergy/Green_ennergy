<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Operator extends Model
{
    protected $table = 'operators';

    protected $primaryKey = 'id_operator';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'role',
        'city',
        'duty_status',
        'specialties',
    ];

    protected $casts = [
        'specialties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function installations(): HasMany
    {
        return $this->hasMany(Installation::class, 'id_operator', 'id_operator');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'id_operator', 'id_operator');
    }

    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class, 'id_operator', 'id_operator');
    }
}
