<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Association Product <-> Order (order line items)
        Schema::create('order_items', function (Blueprint $table) {
            $table->foreignId('id_product')->constrained('products', 'id_product')->cascadeOnDelete();
            $table->foreignId('id_order')->constrained('orders', 'id_order')->cascadeOnDelete();
            $table->smallInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->primary(['id_product', 'id_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
