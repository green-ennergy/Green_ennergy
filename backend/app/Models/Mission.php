<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mission extends Model
{
    protected $fillable = [
        'code',
        'type',
        'title',
        'status',
        'priority',
        'scheduled_date',
        'time_slot',
        'client_name',
        'client_phone',
        'client_email',
        'client_address',
        'client_city',
        'admin_notes',
        'operator_notes',
        'type_data',
        'id_operator',
        'id_project',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'type_data' => 'array',
    ];

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'id_operator', 'id_operator');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'id_project', 'id_project');
    }

    public function traces(): HasMany
    {
        return $this->hasMany(MissionTrace::class, 'id_mission')->orderByDesc('created_at');
    }
}
