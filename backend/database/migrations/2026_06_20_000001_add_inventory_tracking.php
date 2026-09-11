<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('units_sold')->default(0)->after('stock');
        });

        Schema::table('rfq_tickets', function (Blueprint $table) {
            $table->boolean('stock_deducted')->default(false)->after('total_quantity');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('units_sold');
        });

        Schema::table('rfq_tickets', function (Blueprint $table) {
            $table->dropColumn('stock_deducted');
        });
    }
};
