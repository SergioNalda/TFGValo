<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('miras', function (Blueprint $table) {
        $table->string('estado')->default('pendiente'); // valores: pendiente, aprobado, rechazado
    });
}

public function down()
{
    Schema::table('miras', function (Blueprint $table) {
        $table->dropColumn('estado');
    });
}

};
