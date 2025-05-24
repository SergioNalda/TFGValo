<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Estrategia;

class Favorito extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'estrategia_id'];

    public function estrategia()
    {
        return $this->belongsTo(Estrategia::class);
    }
}

