<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estrategia extends Model
{
    protected $fillable = [
        'user_id',
        'titulo',
        'descripcion',
        'tipo',
        'video',
        'mapa',
        'agentes',
        'is_approved',
    ];

    protected $casts = [
        'agentes' => 'array',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // app/Models/Estrategia.php
    public function favoritos()
    {
    return $this->belongsToMany(User::class, 'favoritos')->withTimestamps();
    }
}

