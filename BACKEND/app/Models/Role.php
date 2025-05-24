<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Asegúrate de importar el modelo User

class Role extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables de forma masiva.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name', // o cualquier otro atributo relacionado con el rol
    ];

    /**
     * Relación inversa con el modelo User
     */
    public function users()
    {
        return $this->hasMany(User::class); // Un rol puede tener muchos usuarios
    }
}
