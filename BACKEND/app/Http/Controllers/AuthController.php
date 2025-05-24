<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Validación simple
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Intentar autenticar
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        // Obtener usuario autenticado
        $user = auth()->user();

        // Aquí validas que el usuario esté activo
        if ($user->estado == 0) {
            return response()->json(['message' => 'Tu cuenta está desactivada. Contacta con un administrador.'], 403);
        }

        // Devolver token + datos usuario
        return response()->json([
            'token' => $token,
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role_id' => $user->role_id
            ]
        ]);
    }

    // REGISTER
    public function register(Request $request)
    {
        $data = $request->only('name', 'email', 'password', 'password_confirmation', 'role_id');

        $validator = Validator::make($data, [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
            'role_id'               => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        unset($data['password_confirmation']);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id'  => $data['role_id'],
            'estado'   => 1 // Por defecto activo al crear
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role_id' => $user->role_id
            ]
        ], 201);
    }
}
