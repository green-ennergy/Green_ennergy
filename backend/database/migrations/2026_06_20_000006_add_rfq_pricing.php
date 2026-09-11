<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rfq_items', function (Blueprint $table) {
            $table->decimal('unit_price', 12, 2)->nullable()->after('quantity');
        });

        Schema::table('rfq_tickets', function (Blueprint $table) {
            $table->decimal('quoted_total', 12, 2)->nullable()->after('total_quantity');
            $table->boolean('client_confirmed')->default(false)->after('quoted_total');
        });
    }

    public function down(): void
    {
        Schema::table('rfq_items', function (Blueprint $table) {
            $table->dropColumn('unit_price');
        });

        Schema::table('rfq_tickets', function (Blueprint $table) {
            $table->dropColumn(['quoted_total', 'client_confirmed']);
        });
    }
};
