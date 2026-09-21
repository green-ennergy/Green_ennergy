<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installations', function (Blueprint $table) {
            $table->id('id_installation');
            $table->string('name', 255);
            $table->string('energy_type', 100)->nullable();
            $table->string('location', 255)->nullable();
            $table->string('status', 100)->default('scheduled');
            $table->dateTime('creation_date');
            $table->foreignId('id_project')->nullable()->constrained('projects', 'id_project')->nullOnDelete();
            $table->foreignId('id_operator')->nullable()->constrained('operators', 'id_operator')->nullOnDelete();
            $table->foreignId('id_client')->constrained('clients', 'id_client')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installations');
    }
};
