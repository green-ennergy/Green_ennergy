<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id('id_maintenance');
            $table->string('type', 100);
            $table->dateTime('scheduled_at');
            $table->string('status', 100)->default('scheduled');
            $table->text('description')->nullable();
            $table->foreignId('id_installation')->constrained('installations', 'id_installation')->cascadeOnDelete();
            $table->foreignId('id_operator')->nullable()->constrained('operators', 'id_operator')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
