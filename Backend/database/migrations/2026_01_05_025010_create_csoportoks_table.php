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
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('csoport_tipus_id');
            $table->foreign('csoport_tipus_id')->references('id')->on('csoport_tipusok');
            $table->string('megnevezes');
            $table->string('keszito_felhasznalo_id');
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
