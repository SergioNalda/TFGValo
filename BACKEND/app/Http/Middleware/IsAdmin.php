<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obtener el usuario autenticado desde el token
        $user = JWTAuth::parseToken()->authenticate();

        // Si no es admin, denegar acceso
        if (!$user || $user->role_id !== 1) {
            return response()->json(['error' => 'Acceso no autorizado'], 403);
        }

        return $next($request);
    }
}
