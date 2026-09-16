<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id('id_quote');
            $table->string('number', 255)->unique();
            $table->string('company', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('status', 100)->default('pending');
            $table->integer('total_quantity')->default(0);
            $table->float('amount')->default(0);
            $table->boolean('client_confirmed')->default(false);
            $table->boolean('stock_deducted')->default(false);
            $table->dateTime('creation_date');
            $table->foreignId('id_admin')->nullable()->constrained('administrators', 'id_admin')->nullOnDelete();
            $table->foreignId('id_project')->nullable()->constrained('projects', 'id_project')->nullOnDelete();
            // FK from association "creates" (client -> quote_requests)
            $table->foreignId('id_client')->constrained('clients', 'id_client')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
