<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
class RankingController extends Controller
{
    public function ranking()
    {
    $ranking = User::where('role_id', '!=', 1) // Excluir admins
                ->withCount('estrategias')
                ->orderByDesc('estrategias_count')
                ->get(['id', 'name']);

    return response()->json($ranking);
    }


}
