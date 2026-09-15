<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('name', 50);
            $table->string('company', 50)->nullable();
            $table->string('email', 50)->unique();
            $table->string('phone', 50)->nullable();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->date('creation_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
