<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('id_product');
            $table->string('reference', 50)->unique();
            $table->string('title', 50);
            $table->float('rating')->nullable();
            $table->smallInteger('stock')->default(0);
            $table->integer('sales')->default(0);
            $table->text('image')->nullable();
            $table->string('description', 200)->nullable();
            $table->string('climate_info', 250)->nullable();
            $table->text('highlights')->nullable();
            $table->text('specs')->nullable();
            $table->text('documents')->nullable();
            $table->float('capacity')->nullable();
            $table->float('weight_kg')->nullable();
            $table->float('surface')->nullable();
            $table->foreignId('id_category')->constrained('categories', 'id_category')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
