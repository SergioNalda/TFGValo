<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EstrategiaController;
use App\Http\Controllers\MiraController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\FavoritoController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicUserController;


/**
 * RUTAS DE AUTENTICACIÓN (Públicas)
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * RUTAS PÚBLICAS (sin auth)
 */
Route::get('/miras', [MiraController::class, 'index']);
Route::get('/miras/{id}', [MiraController::class, 'show']);

Route::get('/agentes', function () {
    return response()->json([
        'Breach', 'Brimstone', 'Cypher', 'Fade', 'Gekko', 'Harbor', 'Kyo', 'Omen',
        'Phoenix', 'Raze', 'Sova', 'Viper', 'Yoru'
    ]);
});

/**
 * RUTAS PROTEGIDAS POR JWT Y USUARIO ACTIVO
 */
Route::middleware(['jwt.auth', 'check.user.active'])->group(function () {

    // Usuario autenticado
    Route::get('/me', [AuthController::class, 'me']);

    // Estrategias del usuario
    // Ruta pública
    Route::get('/estrategias', [EstrategiaController::class, 'index']);
    Route::get('/estrategias/{id}', [EstrategiaController::class, 'show']);
    Route::post('/estrategias', [EstrategiaController::class, 'store']);
    Route::put('/estrategias/{id}', [EstrategiaController::class, 'update']);
    Route::delete('/estrategias/{id}', [EstrategiaController::class, 'destroy']);

    // Ranking
    Route::get('/ranking', [RankingController::class, 'ranking']);

    // Favoritos
    Route::get('/favoritos', [FavoritoController::class, 'index']);
    Route::get('/favoritos/{userId}', [FavoritoController::class, 'favoritosPorUsuario']);
    Route::post('/favoritos', [FavoritoController::class, 'store']);
    Route::delete('/favoritos/{userId}/{estrategiaId}', [FavoritoController::class, 'eliminarFavorito']);

    // Miras
    Route::post('/miras', [MiraController::class, 'store']);
    Route::put('/miras/{id}', [MiraController::class, 'update']);
    Route::delete('/miras/{id}', [MiraController::class, 'destroy']);
});

/**
 * RUTAS ADMIN (JWT, usuario activo y rol admin)
 */
Route::middleware(['jwt.auth', 'check.user.active', 'is.admin'])->prefix('admin')->group(function () {

    // Gestión de usuarios
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    Route::patch('/users/{id}/estado', [AdminUserController::class, 'updateEstado']);

    // Gestión de estrategias (admin)
    Route::get('/estrategias', [EstrategiaController::class, 'indexAdmin']);
    Route::patch('/estrategias/{id}/aprobar', [EstrategiaController::class, 'aprobar']);
    Route::put('/estrategias/{id}', [EstrategiaController::class, 'update']);
    Route::delete('/estrategias/{id}', [EstrategiaController::class, 'destroy']);

    // Aprobación de miras
    Route::get('/miras/pendientes', [MiraController::class, 'pendientes']);
    Route::patch('/miras/{id}/estado', [MiraController::class, 'cambiarEstado']);
});

/**
 * Perfil usuario
 */
Route::middleware(['jwt.auth', 'check.user.active'])->group(function () {
    Route::get('/user', [ProfileController::class, 'profile']);
    Route::post('/user/update', [ProfileController::class, 'updateProfile']);
});

Route::get('/public-profile/{id}', [PublicUserController::class, 'show']);


