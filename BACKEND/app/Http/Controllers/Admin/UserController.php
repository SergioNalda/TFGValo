<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
{
    $users = User::where('role_id', '!=', 1)  // Suponiendo que 1 es admin
        ->withCount(['estrategias', 'favoritos'])
        ->get(['id', 'name', 'email', 'role_id', 'created_at', 'last_login', 'estado']);  // Añadido estado

    foreach ($users as $user) {
        $user->role_name = $user->role_id == 1 ? 'Admin' : 'Usuario';
    }

    return response()->json($users);
}

    // Mostrar info de un usuario concreto (opcional)
    public function show($id)
    {
        $user = User::where('role_id', '!=', 1)->findOrFail($id);

        return response()->json($user);
    }

    // Actualizar usuario
    public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
        'role_id' => 'sometimes|required|integer|in:1,2',
        'password' => 'nullable|string|min:6|confirmed',
    ]);

    if ($request->has('name')) {
        $user->name = $request->name;
    }

    if ($request->has('email')) {
        $user->email = $request->email;
    }

    if ($request->has('role_id')) {
        $user->role_id = $request->role_id;
    }

    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    $user->save();

    return response()->json(['message' => 'Usuario actualizado']);
}


    // Eliminar usuario
    public function destroy($id)
    {
        $user = User::where('role_id', '!=', 1)->findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function updateEstado(Request $request, $id)
    {
    $user = User::where('role_id', '!=', 1)->findOrFail($id);

    $request->validate([
        'estado' => 'required|integer|in:0,1',
    ]);

    $user->estado = $request->estado;
    $user->save();

    return response()->json([
        'message' => 'Estado actualizado correctamente',
        'estado' => $user->estado,
    ]);
    }

    public function updateProfile(Request $request)
{
    $user = auth()->user();

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:500',
        'profile_photo' => 'nullable|image|max:2048', // Max 2MB
    ]);

    $user->name = $request->name;
    $user->description = $request->description;

    if ($request->hasFile('profile_photo')) {
        $file = $request->file('profile_photo');
        $path = $file->store('profile_photos', 'public'); // Guarda en storage/app/public/profile_photos
        $user->profile_photo = $path;
    }

    $user->save();

    return response()->json(['message' => 'Perfil actualizado con éxito']);
}



}
