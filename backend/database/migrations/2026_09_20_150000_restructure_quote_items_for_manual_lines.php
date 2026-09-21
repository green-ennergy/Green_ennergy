<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quote_items', function (Blueprint $table) {
            $table->dropForeign(['id_product']);
        });

        DB::statement('ALTER TABLE quote_items DROP CONSTRAINT IF EXISTS quote_items_pkey');

        Schema::table('quote_items', function (Blueprint $table) {
            $table->id('id_item');
        });

        DB::statement('ALTER TABLE quote_items ALTER COLUMN id_product DROP NOT NULL');

        Schema::table('quote_items', function (Blueprint $table) {
            $table->foreign('id_product')
                ->references('id_product')
                ->on('products')
                ->cascadeOnDelete();
            $table->unique(['id_quote', 'id_product']);
        });
    }

    public function down(): void
    {
        Schema::table('quote_items', function (Blueprint $table) {
            $table->dropForeign(['id_product']);
            $table->dropUnique(['id_quote', 'id_product']);
        });

        DB::table('quote_items')->whereNull('id_product')->delete();

        DB::statement('ALTER TABLE quote_items ALTER COLUMN id_product SET NOT NULL');

        Schema::table('quote_items', function (Blueprint $table) {
            $table->dropColumn('id_item');
        });

        Schema::table('quote_items', function (Blueprint $table) {
            $table->primary(['id_product', 'id_quote']);
            $table->foreign('id_product')
                ->references('id_product')
                ->on('products')
                ->cascadeOnDelete();
        });
    }
};
