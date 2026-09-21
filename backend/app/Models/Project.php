<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    protected $table = 'projects';

    protected $primaryKey = 'id_project';

    public $timestamps = false;

    protected $fillable = [
        'name', 'type', 'progress', 'status', 'completed_steps', 'description',
        'location', 'energy_need', 'collection_data', 'energy_data',
        'admin_notes', 'start_date', 'end_date', 'id_client',
    ];

    protected $casts = [
        'completed_steps' => 'array',
        'collection_data' => 'array',
        'energy_data' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client', 'id_client');
    }

    public function traces(): HasMany
    {
        return $this->hasMany(ProjectTrace::class, 'id_project', 'id_project')->orderByDesc('created_at');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ProjectMessage::class, 'id_project', 'id_project')->orderBy('created_at');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(ProjectMessage::class, 'id_project', 'id_project')->latestOfMany('created_at');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'id_project', 'id_project');
    }

    public function quoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class, 'id_project', 'id_project');
    }

    public function installations(): HasMany
    {
        return $this->hasMany(Installation::class, 'id_project', 'id_project');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'id_project', 'id_project');
    }
}
