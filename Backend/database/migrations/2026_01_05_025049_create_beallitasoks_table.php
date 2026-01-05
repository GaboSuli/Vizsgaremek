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
        Schema::create('beallitasok', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tema_id');
            $table->foreign('tema_id')->references('id')->on('temak');
            $table->boolean('kuponok')->default(true);
            $table->boolean('termekArKovetes')->default(true);
            $table->boolean('brokerArKovetes')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beallitasok');
    }
};
