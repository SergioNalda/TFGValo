<?php

namespace App\Http\Controllers;

use App\Models\Mira;
use Illuminate\Http\Request;

class MiraController extends Controller
{
    // Crear mira, siempre con estado 'pendiente'
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'imagen' => 'nullable|image|max:2048',
                'tipo' => 'required|in:all,pros',
                'codigo' => 'required|string',
            ]);

            $mira = new Mira();
            $mira->nombre = $request->nombre;
            $mira->tipo = $request->tipo;
            $mira->codigo = $request->codigo;
            $mira->estado = 'pendiente'; // NUEVO

            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store('miras', 'public');
                $mira->imagen = $path;
            }

            $mira->save();

            return response()->json(['message' => 'Mira creada correctamente', 'mira' => $mira], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Listar sólo miras APROBADAS para usuarios públicos
    public function index()
    {
        $miras = Mira::where('estado', 'aprobado')->get()->map(function ($mira) {
            return [
                'id' => $mira->id,
                'nombre' => $mira->nombre,
                'codigo' => $mira->codigo,
                'tipo' => $mira->tipo,
                'imagen' => $mira->imagen,
            ];
        });

        return response()->json($miras);
    }

    // Mostrar detalles de una mira (sin filtro de estado, o puedes agregar)
    public function show($id)
    {
        $mira = Mira::findOrFail($id);
        return response()->json($mira);
    }

    // Actualizar mira (sin cambiar estado aquí)
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'tipo' => 'required|in:all,pros',
                'codigo' => 'required|string',
                'imagen' => 'nullable|image|max:2048',
            ]);

            $mira = Mira::findOrFail($id);
            $mira->nombre = $request->nombre;
            $mira->tipo = $request->tipo;
            $mira->codigo = $request->codigo;

            if ($request->hasFile('imagen')) {
                if ($mira->imagen) {
                    \Storage::disk('public')->delete($mira->imagen);
                }
                $path = $request->file('imagen')->store('miras', 'public');
                $mira->imagen = $path;
            }

            $mira->save();

            return response()->json(['message' => 'Mira actualizada correctamente', 'mira' => $mira]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Eliminar mira
    public function destroy($id)
    {
        $mira = Mira::findOrFail($id);

        if ($mira->imagen) {
            \Storage::disk('public')->delete($mira->imagen);
        }

        $mira->delete();

        return response()->json(['message' => 'Mira eliminada correctamente']);
    }

    // --- NUEVOS MÉTODOS PARA ADMINISTRAR APROBACIÓN ---

    // Listar miras PENDIENTES (solo admin)
    public function pendientes()
    {
        $mirasPendientes = Mira::where('estado', 'pendiente')->get();
        return response()->json($mirasPendientes);
    }

    // Cambiar estado de una mira (aprobado/rechazado)
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:aprobado,rechazado',
        ]);

        $mira = Mira::findOrFail($id);
        $mira->estado = $request->estado;
        $mira->save();

        return response()->json(['message' => 'Estado actualizado correctamente', 'mira' => $mira]);
    }
    
}
