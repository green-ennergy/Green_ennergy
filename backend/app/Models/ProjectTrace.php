<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTrace extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'action',
        'changes',
        'summary',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
