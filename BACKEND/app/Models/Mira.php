<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mira extends Model
{
    protected $fillable = [
        'titulo',
        'imagen',
        'codigo',
        'tipo',
        'estado',
    ];
}
