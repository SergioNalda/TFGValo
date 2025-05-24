<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // En tu archivo de migración, por ejemplo: database/migrations/xxxx_xx_xx_create_estrategias_table.php
    public function up()
    {
        Schema::create('estrategias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('tipo'); // por ejemplo: 'ataque', 'defensa', 'lineup'
            $table->string('mapa'); // nuevo campo para mapa
            $table->json('agentes'); // nuevo campo para agentes
            $table->string('video'); // Cambiar a obligatorio, eliminando nullable
            $table->timestamps();
        });
    }





    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estrategias');
    }
};
