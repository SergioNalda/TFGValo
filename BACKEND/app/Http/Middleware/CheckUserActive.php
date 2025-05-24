<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckUserActive
{
    public function handle(Request $request, Closure $next)
    {
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || $user->estado == 0) {
            return response()->json(['error' => 'Cuenta desactivada o usuario no autorizado.'], 401);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Token inválido o no proporcionado.'], 401);
    }

    return $next($request);
    }
}
