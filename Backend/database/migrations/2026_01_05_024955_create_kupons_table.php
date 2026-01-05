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
        Schema::create('kupon', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('kezdesi_datum');
            $table->date('lejarasi_datum');
            $table->string('kod');
            $table->integer('kedvezmeny_szazalek');
            $table->string('hasznalasi_hely');
            $table->integer('feltolto_kuponos_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kupon');
    }
};
