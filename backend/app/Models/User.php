<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $primaryKey = 'id_user';

    protected $appends = ['role'];

    public $timestamps = false;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'password',
        'creation_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'creation_date' => 'date',
        'password' => 'hashed',
    ];

    public function client(): HasOne
    {
        return $this->hasOne(Client::class, 'id_user', 'id_user');
    }

    public function administrator(): HasOne
    {
        return $this->hasOne(Administrator::class, 'id_user', 'id_user');
    }

    public function operator(): HasOne
    {
        return $this->hasOne(Operator::class, 'id_user', 'id_user');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'id_user', 'id_user');
    }

    public function isClient(): bool
    {
        return $this->client()->exists();
    }

    public function isAdministrator(): bool
    {
        return $this->administrator()->exists();
    }

    public function isOperator(): bool
    {
        return $this->operator()->exists();
    }

    public function getRoleAttribute(): ?string
    {
        if ($this->isAdministrator()) {
            return 'administrator';
        }

        if ($this->isOperator()) {
            return 'operator';
        }

        if ($this->isClient()) {
            return 'client';
        }

        return null;
    }
}
