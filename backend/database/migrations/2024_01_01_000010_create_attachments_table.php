<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id('id_attachment');
            $table->string('file_name', 255);
            $table->string('path', 255);
            $table->string('file_type', 100)->nullable();
            $table->dateTime('uploaded_at');
            $table->foreignId('id_project')->constrained('projects', 'id_project')->cascadeOnDelete();
            $table->foreignId('id_user')->constrained('users', 'id_user')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
