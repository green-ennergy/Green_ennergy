<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Association Product <-> Quote (quote line items)
        Schema::create('quote_items', function (Blueprint $table) {
            $table->foreignId('id_product')->constrained('products', 'id_product')->cascadeOnDelete();
            $table->foreignId('id_quote')->constrained('quote_requests', 'id_quote')->cascadeOnDelete();
            $table->string('label', 50)->nullable();
            $table->decimal('unit_price', 15, 2);
            $table->string('line_type', 50)->nullable();
            $table->smallInteger('quantity')->default(1);
            $table->primary(['id_product', 'id_quote']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_items');
    }
};
