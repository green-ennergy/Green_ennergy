<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rfq_items', function (Blueprint $table) {
            $table->string('label')->nullable()->after('product_id');
            $table->string('item_type', 32)->default('product')->after('label');
        });

        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE rfq_items ALTER COLUMN product_id DROP NOT NULL');
        } else {
            Schema::table('rfq_items', function (Blueprint $table) {
                $table->unsignedBigInteger('product_id')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('rfq_items', function (Blueprint $table) {
            $table->dropColumn(['label', 'item_type']);
        });
    }
};
