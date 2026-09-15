<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('id_order');
            $table->string('number', 255)->unique();
            $table->string('status', 100)->default('pending');
            $table->float('amount')->default(0);
            $table->dateTime('creation_date');
            $table->foreignId('id_client')->constrained('clients', 'id_client')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
