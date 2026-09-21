<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->foreignId('id_service_request')
                ->nullable()
                ->after('id_project')
                ->constrained('service_requests', 'id_service_request')
                ->nullOnDelete();
            $table->unique('id_service_request');
        });
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->dropUnique(['id_service_request']);
            $table->dropConstrainedForeignId('id_service_request');
        });
    }
};
