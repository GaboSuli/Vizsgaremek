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
            $table->id();
            $table->integer('veves_lista_id');
            $table->integer('alKategoria_id');
            $table->integer('ar');
            $table->integer('mennyiseg');
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
