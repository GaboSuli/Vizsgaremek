<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('veves_objekt', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->unsignedBigInteger('veves_lista_id');
            $table->foreign('veves_lista_id')->references('id')->on('veves_lista');
            $table->unsignedBigInteger('alKategoria_id');
            $table->foreign('alKategoria_id')->references('id')->on('alkategoriak');
            $table->string('megnevezes');
            $table->float('ar');
            $table->float('mennyiseg');
            $table->boolean("elfogadott_statisztikara")->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('veves_objekt');
    }
};
