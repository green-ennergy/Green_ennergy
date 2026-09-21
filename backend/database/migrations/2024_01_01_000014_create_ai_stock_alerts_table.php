<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_stock_alerts', function (Blueprint $table) {
            $table->id('id_alert');
            $table->string('risk_level', 100);
            $table->integer('analyzed_stock')->default(0);
            $table->integer('forecasted_sales')->default(0);
            $table->integer('quantity_to_order')->default(0);
            $table->integer('confidence')->default(0);
            $table->json('reasons')->nullable();
            $table->dateTime('analyzed_at');
            $table->foreignId('id_product')->constrained('products', 'id_product')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_stock_alerts');
    }
};
