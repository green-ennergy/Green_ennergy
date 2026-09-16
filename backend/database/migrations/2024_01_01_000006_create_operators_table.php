<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operators', function (Blueprint $table) {
            $table->id('id_operator');
            $table->foreignId('id_user')->unique()->constrained('users', 'id_user')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operators');
    }
};
