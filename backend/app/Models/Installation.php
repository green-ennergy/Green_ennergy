<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Installation extends Model
{
    protected $table = 'installations';

    protected $primaryKey = 'id_installation';

    public $timestamps = false;

    protected $fillable = [
        'name', 'energy_type', 'location', 'status', 'creation_date',
        'id_project', 'id_operator', 'id_client',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'id_project', 'id_project');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'id_operator', 'id_operator');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client', 'id_client');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'id_installation', 'id_installation');
    }
}
