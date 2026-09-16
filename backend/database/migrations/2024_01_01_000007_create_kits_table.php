<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kits', function (Blueprint $table) {
            $table->id('id_kit');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('status', 100)->default('draft');
            $table->dateTime('creation_date');
            $table->foreignId('id_admin')->constrained('administrators', 'id_admin')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kits');
    }
};
