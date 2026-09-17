<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('operators', function (Blueprint $table) {
            $table->string('role', 100)->default('Field operator');
            $table->string('city', 100)->nullable();
            $table->string('duty_status', 20)->default('on_duty');
            $table->json('specialties')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('operators', function (Blueprint $table) {
            $table->dropColumn(['role', 'city', 'duty_status', 'specialties']);
        });
    }
};
