<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id('id_service');
            $table->string('slug', 100)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('icon', 50)->default('installation');
            $table->string('estimated_duration', 100)->nullable();
            $table->string('starting_price', 100)->nullable();
            $table->boolean('enabled')->default(true);
            $table->json('bullets')->nullable();
            $table->json('realization_steps')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->dateTime('creation_date');
        });

        Schema::create('service_requests', function (Blueprint $table) {
            $table->id('id_service_request');
            $table->string('number', 50)->unique();
            $table->foreignId('id_service')->constrained('services', 'id_service')->cascadeOnDelete();
            $table->foreignId('id_client')->nullable()->constrained('clients', 'id_client')->nullOnDelete();
            $table->foreignId('id_operator')->nullable()->constrained('operators', 'id_operator')->nullOnDelete();
            $table->string('client_name', 255);
            $table->string('client_email', 255);
            $table->string('client_phone', 50)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('address', 255)->nullable();
            $table->text('notes')->nullable();
            $table->date('preferred_date')->nullable();
            $table->string('status', 32)->default('pending');
            $table->unsignedTinyInteger('current_phase')->default(1);
            $table->json('history')->nullable();
            $table->dateTime('creation_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
        Schema::dropIfExists('services');
    }
};
