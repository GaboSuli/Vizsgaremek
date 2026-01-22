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
            $table->engine = 'InnoDB';
            $table->id();
            $table->timestamps();
            $table->date('kezdesi_datum');
            $table->date('lejarasi_datum');
            $table->string('kod');
            $table->string('kedvezmeny');
            $table->string('megjegyzes');
            $table->string('hasznalasi_hely');
            $table->foreignId('feltolto_kuponos_id');
            $table->foreign('feltolto_kuponos_id')->references('id')->on('users');
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
