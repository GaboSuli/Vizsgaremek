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
        Schema::create('csoportok', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('csoport_tipus_id');
            $table->foreign('csoport_tipus_id')->references('id')->on('csoport_tipusok');
            $table->string('megnevezes');
            $table->unsignedBigInteger('keszito_felhasznalo_id');
            $table->foreign('keszito_felhasznalo_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csoportok');
    }
};
