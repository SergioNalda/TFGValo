<?php

namespace App\Http\Controllers;

use App\Models\User;

class PublicUserController extends Controller
{
public function show($id)
{
    $user = User::with('estrategias')->findOrFail($id);

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'description' => $user->description,
        'estrategias' => $user->estrategias,
    ]);
}

}

