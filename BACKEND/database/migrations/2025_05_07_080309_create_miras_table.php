<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMirasTable extends Migration
{
    public function up()
{
    Schema::create('miras', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('imagen'); // Ruta o URL de la imagen
        $table->string('codigo'); // Código personalizado
        $table->timestamps();
    });
}


    public function down()
    {
        Schema::dropIfExists('miras');
    }
}
