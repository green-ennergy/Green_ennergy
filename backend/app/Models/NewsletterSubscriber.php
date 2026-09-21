<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'email',
        'creation_date',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
    ];
}
