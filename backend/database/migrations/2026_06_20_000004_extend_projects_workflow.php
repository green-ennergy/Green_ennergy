<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('location')->nullable()->after('description');
            $table->string('study_level')->nullable()->after('location'); // ht, mt, bt
            $table->boolean('grid_connected')->nullable()->after('study_level');
            $table->string('estimated_energy_need')->nullable()->after('grid_connected');
            $table->json('collection_data')->nullable()->after('estimated_energy_need');
            $table->json('energy_data')->nullable()->after('collection_data');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'location',
                'study_level',
                'grid_connected',
                'estimated_energy_need',
                'collection_data',
                'energy_data',
            ]);
        });
    }
};
