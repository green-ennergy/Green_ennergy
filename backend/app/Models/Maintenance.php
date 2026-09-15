<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    protected $table = 'maintenances';

    protected $primaryKey = 'id_maintenance';

    public $timestamps = false;

    protected $fillable = [
        'type', 'scheduled_at', 'status', 'description', 'id_installation', 'id_operator',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function installation(): BelongsTo
    {
        return $this->belongsTo(Installation::class, 'id_installation', 'id_installation');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'id_operator', 'id_operator');
    }
}
