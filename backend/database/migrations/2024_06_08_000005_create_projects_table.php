<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['solar_design', 'installation', 'study', 'maintenance', 'support'])->default('solar_design');
            $table->enum('status', ['premier_contact', 'data_collection', 'energy_data', 'completed', 'on_hold'])->default('premier_contact');
            $table->integer('progress')->default(0);
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
