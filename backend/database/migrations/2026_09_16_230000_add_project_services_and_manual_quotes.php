<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->string('origin', 20)->nullable();
        });

        Schema::table('installations', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->dateTime('scheduled_at')->nullable();
        });

        Schema::table('maintenances', function (Blueprint $table) {
            $table->dropForeign(['id_installation']);
        });

        DB::statement('ALTER TABLE maintenances ALTER COLUMN id_installation DROP NOT NULL');
        DB::statement('ALTER TABLE maintenances ALTER COLUMN scheduled_at DROP NOT NULL');

        Schema::table('maintenances', function (Blueprint $table) {
            $table->foreign('id_installation')
                ->references('id_installation')
                ->on('installations')
                ->nullOnDelete();
            $table->foreignId('id_project')->nullable()->constrained('projects', 'id_project')->cascadeOnDelete();
            $table->decimal('price', 15, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('maintenances', function (Blueprint $table) {
            $table->dropForeign(['id_project']);
            $table->dropColumn(['id_project', 'price']);
            $table->dropForeign(['id_installation']);
        });

        DB::statement('ALTER TABLE maintenances ALTER COLUMN id_installation SET NOT NULL');
        DB::statement('ALTER TABLE maintenances ALTER COLUMN scheduled_at SET NOT NULL');

        Schema::table('maintenances', function (Blueprint $table) {
            $table->foreign('id_installation')
                ->references('id_installation')
                ->on('installations')
                ->cascadeOnDelete();
        });

        Schema::table('installations', function (Blueprint $table) {
            $table->dropColumn(['description', 'price', 'scheduled_at']);
        });

        Schema::table('quote_requests', function (Blueprint $table) {
            $table->dropColumn('origin');
        });
    }
};
