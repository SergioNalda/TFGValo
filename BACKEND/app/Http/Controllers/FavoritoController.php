<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorito;
use App\Models\User;

class FavoritoController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = auth()->user();

            $favorito = new Favorito();
            $favorito->user_id = $user->id;
            $favorito->estrategia_id = $request->estrategia_id;
            $favorito->save();

            return response()->json(['message' => 'Añadido a favoritos'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al guardar favorito',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function favoritosPorUsuario($userId)
    {
        $favoritos = Favorito::with('estrategia')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($favorito) {
                return $favorito->estrategia;
            });

        return response()->json($favoritos);
    }

    public function index()
    {
    $favoritos = Favorito::all();
    return response()->json($favoritos);
    }

    public function eliminarFavorito($userId, $estrategiaId)
{
    $favorito = Favorito::where('user_id', $userId)
                        ->where('estrategia_id', $estrategiaId)
                        ->first();

    if (!$favorito) {
        return response()->json(['message' => 'Favorito no encontrado'], 404);
    }

    $favorito->delete();

    return response()->json(['message' => 'Favorito eliminado correctamente']);
}


}




