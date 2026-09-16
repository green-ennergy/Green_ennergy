<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id('id_project');
            $table->string('name', 255);
            $table->string('type', 100)->nullable();
            $table->integer('progress')->default(0);
            $table->string('status', 100)->default('pending');
            $table->json('completed_steps')->nullable();
            $table->text('description')->nullable();
            $table->string('location', 255)->nullable();
            $table->string('energy_need', 255)->nullable();
            $table->json('collection_data')->nullable();
            $table->json('energy_data')->nullable();
            $table->text('admin_notes')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('id_client')->constrained('clients', 'id_client')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
