<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(
            ['id' => 1],
            ['name' => 'Admin', 'updated_at' => now(), 'created_at' => now()]
        );

        DB::table('roles')->updateOrInsert(
            ['id' => 2],
            ['name' => 'User', 'updated_at' => now(), 'created_at' => now()]
        );
    }
}
