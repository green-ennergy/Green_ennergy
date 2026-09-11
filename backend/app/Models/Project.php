<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        'rfq_ticket_id',
        'type',
        'status',
        'progress',
        'completed_steps',
        'description',
        'location',
        'study_level',
        'grid_connected',
        'estimated_energy_need',
        'collection_data',
        'energy_data',
        'admin_notes',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'completed_steps' => 'array',
        'collection_data' => 'array',
        'energy_data' => 'array',
        'grid_connected' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rfqTicket()
    {
        return $this->belongsTo(RfqTicket::class);
    }

    public function traces()
    {
        return $this->hasMany(ProjectTrace::class)->latest();
    }
}
