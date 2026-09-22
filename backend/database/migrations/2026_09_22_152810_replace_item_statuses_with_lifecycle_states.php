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
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE lost_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed', 'available', 'awaiting_pickup', 'unclaimed', 'archived') NOT NULL DEFAULT 'available'");
            DB::statement("ALTER TABLE found_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed', 'available', 'awaiting_pickup', 'unclaimed', 'archived') NOT NULL DEFAULT 'available'");
        }

        DB::table('lost_items')->whereIn('status', ['lost', 'found'])->update(['status' => 'available']);
        DB::table('found_items')->whereIn('status', ['lost', 'found'])->update(['status' => 'available']);
        DB::table('lost_items')->whereIn('status', ['claimed', 'verified'])->update(['status' => 'awaiting_pickup']);
        DB::table('found_items')->whereIn('status', ['claimed', 'verified'])->update(['status' => 'awaiting_pickup']);
        DB::table('lost_items')->whereIn('status', ['rejected', 'closed'])->update(['status' => 'archived']);
        DB::table('found_items')->whereIn('status', ['rejected', 'closed'])->update(['status' => 'archived']);

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE lost_items MODIFY status ENUM('available', 'awaiting_pickup', 'returned', 'unclaimed', 'archived') NOT NULL DEFAULT 'available'");
            DB::statement("ALTER TABLE found_items MODIFY status ENUM('available', 'awaiting_pickup', 'returned', 'unclaimed', 'archived') NOT NULL DEFAULT 'available'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE lost_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed') NOT NULL DEFAULT 'lost'");
            DB::statement("ALTER TABLE found_items MODIFY status ENUM('lost', 'found', 'claimed', 'verified', 'returned', 'rejected', 'closed') NOT NULL DEFAULT 'found'");
        }
    }
};
