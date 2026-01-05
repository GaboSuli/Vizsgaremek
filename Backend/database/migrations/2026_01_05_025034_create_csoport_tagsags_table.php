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
            $table->unsignedBigInteger('felhasznalo_id');
            $table->foreign('felhasznalo_id')->references('id')->on('users');
            $table->unsignedBigInteger('csoport_id');
            $table->foreign('csoport_id')->references('id')->on('csoportok');
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
