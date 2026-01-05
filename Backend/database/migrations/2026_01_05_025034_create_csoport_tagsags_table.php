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
        Schema::create('csoport_tagsag', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('felhasznalo_id');
            $table->integer('csoport_id');
            $table->integer('jogosultsag_szint');
            $table->string('becenev');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csoport_tagsag');
    }
};
