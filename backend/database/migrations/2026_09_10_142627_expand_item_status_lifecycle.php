<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE lost_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed') NOT NULL DEFAULT 'lost'");
        DB::statement("ALTER TABLE found_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed') NOT NULL DEFAULT 'found'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE lost_items MODIFY status ENUM('lost', 'found', 'closed') NOT NULL DEFAULT 'lost'");
        DB::statement("ALTER TABLE found_items MODIFY status ENUM('found', 'claimed', 'closed') NOT NULL DEFAULT 'found'");
    }
};
