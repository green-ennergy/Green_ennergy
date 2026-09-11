<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfqTicket extends Model
{
    protected $table = 'rfq_tickets';

    protected $fillable = [
        'ticket_number',
        'user_id',
        'company_name',
        'email',
        'status',
        'total_quantity',
        'quoted_total',
        'client_confirmed',
        'stock_deducted',
    ];

    protected $casts = [
        'stock_deducted' => 'boolean',
        'client_confirmed' => 'boolean',
        'quoted_total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(RfqItem::class);
    }

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ticket_number = 'RFQ-'.strtoupper(uniqid());
        });
    }
}
