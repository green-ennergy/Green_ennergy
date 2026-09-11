<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_key')->unique();
            $table->string('title');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->text('climate_info')->nullable();
            $table->json('highlights')->nullable();
            $table->json('specs')->nullable();
            $table->json('documents')->nullable();
            $table->decimal('unit_capacity', 10, 2)->nullable();
            $table->decimal('unit_weight', 10, 2)->nullable();
            $table->decimal('unit_area', 10, 2)->nullable();
            $table->boolean('local_onee_cert')->default(false);
            $table->json('related_ids')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
