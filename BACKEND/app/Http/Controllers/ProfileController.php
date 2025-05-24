<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function profile()
    {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->profile_photo = $path;
        }

        $user->name = $request->name ?? $user->name;
        $user->description = $request->description ?? $user->description;
        $user->save();

        return response()->json(['message' => 'Perfil actualizado correctamente', 'user' => $user]);
    }
}
