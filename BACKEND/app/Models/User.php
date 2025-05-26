<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Estrategia; // Asegúrate de importar el modelo Estrategia
use App\Models\Role; // Importa el modelo Role

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Los atributos que son asignables de forma masiva.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id', // Asegúrate de que sea 'role_id' si usas la columna role_id
        'estado',
    ];

    /**
     * Los atributos que deben estar ocultos para la serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser casteados.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Relación con el modelo Estrategia
     */
    public function estrategias()
    {
        return $this->hasMany(Estrategia::class);
    }

    /**
     * Relación con el modelo Role
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // app/Models/User.php
    public function favoritos()
    {
    return $this->belongsToMany(Estrategia::class, 'favoritos');
    }

    public function getProfilePhotoUrlAttribute()
{
    if ($this->profile_photo) {
        return url('storage/' . $this->profile_photo);
    }
    return null; // O url a imagen default si quieres
}


}
