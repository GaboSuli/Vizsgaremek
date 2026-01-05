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
        Schema::create('alkategoriak', function (Blueprint $table) {
            $table->id();
            $table->string('megnevezes');
            $table->unsignedBigInteger('kategoria_id');
            $table->foreign('kategoria_id')->references('id')->on('kategoriak');
            $table->unsignedBigInteger('mennyiseg_tipus_id');
            $table->foreign('mennyiseg_tipus_id')->references('id')->on('mennyiseg_tipusok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alkategoriak');
    }
};
