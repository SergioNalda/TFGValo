<?php

namespace App\Http\Controllers;

use App\Models\Estrategia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class EstrategiaController extends Controller
{
    public function index()
{
    $estrategias = Estrategia::with('user')->where('is_approved', true)->orderBy('created_at', 'desc')->get();

    // Mapear para añadir URL completa al video
    $estrategias->transform(function($estrategia) {
        if ($estrategia->video) {
            $estrategia->video_url = url('storage/' . $estrategia->video);
        } else {
            $estrategia->video_url = null;
        }
        return $estrategia;
    });

    return response()->json($estrategias);
}



    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|string',
            'mapa' => 'required|string|max:100',
            'agentes' => 'required|array',
            'agentes.*' => 'string|max:50',
            'video' => 'required|file|mimetypes:video/mp4,video/webm|max:51200',
        ]);

        $agentes = $validated['agentes'];

        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('videos', 'public');
        }

        $estrategia = Estrategia::create([
            'user_id' => Auth::id(),
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $validated['tipo'],
            'mapa' => $validated['mapa'],
            'agentes' => json_encode($agentes),
            'video' => $videoPath,
        ]);

        return response()->json($estrategia, 201);
    }

    public function indexAdmin()
    {
        $estrategias = Estrategia::with('user')->latest()->get();
        return response()->json($estrategias);
    }

    public function show($id)
    {
        $estrategia = Estrategia::with('user')->findOrFail($id);
        return response()->json($estrategia);
    }

    // Aprobar estrategia
    public function aprobar($id) {
        $estrategia = Estrategia::findOrFail($id);
        $estrategia->is_approved = true;
        $estrategia->save();
        return response()->json(['message' => 'Estrategia aprobada con éxito']);
    }

    // Eliminar estrategia
    public function destroy($id) {
        $estrategia = Estrategia::findOrFail($id);
        $estrategia->delete();
        return response()->json(['message' => 'Estrategia eliminada con éxito']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|string',
            'mapa' => 'required|string|max:100',
            'agentes' => 'required|array',
            'agentes.*' => 'string|max:50',
            'video' => 'nullable|file|mimetypes:video/mp4,video/webm|max:51200',
        ]);

        $estrategia = Estrategia::findOrFail($id);

        // Si envías video nuevo, subir archivo y actualizar ruta
        if ($request->hasFile('video')) {
            // Opcional: elimina video anterior si existe
            if ($estrategia->video && \Storage::disk('public')->exists($estrategia->video)) {
                \Storage::disk('public')->delete($estrategia->video);
            }

            $validated['video'] = $request->file('video')->store('videos', 'public');
        }

        // codificar agentes a JSON porque en BD está como string
        $validated['agentes'] = json_encode($validated['agentes']);

        $estrategia->update($validated);

        return response()->json([
            'message' => 'Estrategia actualizada correctamente',
            'estrategia' => $estrategia->fresh()
        ]);

    }

}
