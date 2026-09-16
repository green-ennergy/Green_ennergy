<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique();
            $table->string('type', 32);
            $table->string('title', 255);
            $table->string('status', 32)->default('assigned');
            $table->string('priority', 16)->default('medium');
            $table->date('scheduled_date');
            $table->string('time_slot', 32);
            $table->string('client_name', 255);
            $table->string('client_phone', 50)->nullable();
            $table->string('client_email', 255)->nullable();
            $table->string('client_address', 255)->nullable();
            $table->string('client_city', 100)->nullable();
            $table->text('admin_notes')->nullable();
            $table->text('operator_notes')->nullable();
            $table->json('type_data')->nullable();
            $table->foreignId('id_operator')->nullable()->constrained('operators', 'id_operator')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('mission_traces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_mission')->constrained('missions')->cascadeOnDelete();
            $table->string('actor', 100);
            $table->string('action', 500);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mission_traces');
        Schema::dropIfExists('missions');
    }
};
