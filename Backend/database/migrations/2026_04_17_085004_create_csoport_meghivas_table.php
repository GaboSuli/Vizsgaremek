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
        Schema::create('csoport_meghivas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId("felhasznalo_id")->references("id")->on("users")->cascadeOnDelete();
            $table->foreignId("csoport_id")->references("id")->on("csoportok")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csoport_meghivas');
    }
};
