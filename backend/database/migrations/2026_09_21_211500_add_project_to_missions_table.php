<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->foreignId('id_project')
                ->nullable()
                ->after('id_operator')
                ->constrained('projects', 'id_project')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_project');
        });
    }
};
