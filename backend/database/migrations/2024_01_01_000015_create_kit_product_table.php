<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Association Product <-> Kit (a kit is composed of products)
        Schema::create('kit_product', function (Blueprint $table) {
            $table->foreignId('id_product')->constrained('products', 'id_product')->cascadeOnDelete();
            $table->foreignId('id_kit')->constrained('kits', 'id_kit')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->string('role', 200)->nullable();
            $table->string('priority', 50)->nullable();
            $table->primary(['id_product', 'id_kit']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kit_product');
    }
};
