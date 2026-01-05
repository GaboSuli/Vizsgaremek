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
        Schema::create('veves_lista', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('felhasznalo_id');
            $table->foreign('felhasznalo_id')->references('id')->on('users');
            $table->unsignedBigInteger('csoport_id')->nullable();
            $table->foreign('csoport_id')->references('id')->on('csoportok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('veves_lista');
    }
};
