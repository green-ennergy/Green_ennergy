<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServiceRequest extends Model
{
    protected $table = 'service_requests';

    protected $primaryKey = 'id_service_request';

    public $timestamps = false;

    protected $fillable = [
        'number',
        'id_service',
        'id_client',
        'id_operator',
        'client_name',
        'client_email',
        'client_phone',
        'city',
        'address',
        'notes',
        'preferred_date',
        'status',
        'current_phase',
        'history',
        'creation_date',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'history' => 'array',
        'creation_date' => 'datetime',
        'current_phase' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_service_request';
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client', 'id_client');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'id_operator', 'id_operator');
    }

    public function mission(): HasOne
    {
        return $this->hasOne(Mission::class, 'id_service_request', 'id_service_request');
    }
}
