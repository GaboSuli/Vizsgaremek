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
            $table->integer('csoport_tipus_id');
            $table->string('megnevezes');
            $table->string('kesito_felhasznalo_id')
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
