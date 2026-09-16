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
        'type', 'scheduled_at', 'status', 'description', 'price',
        'id_installation', 'id_operator', 'id_project',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'price' => 'float',
    ];

    public function installation(): BelongsTo
    {
        return $this->belongsTo(Installation::class, 'id_installation', 'id_installation');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'id_operator', 'id_operator');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'id_project', 'id_project');
    }
}
