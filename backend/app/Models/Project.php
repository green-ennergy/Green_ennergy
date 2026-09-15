<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
