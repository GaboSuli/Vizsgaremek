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
            $table->integer('kategoria_id');
            $table->integer('mennyiseg_tipus_id');
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
