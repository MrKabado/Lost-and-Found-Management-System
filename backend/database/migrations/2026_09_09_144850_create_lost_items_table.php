<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lost_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->text('description');

            $table->unsignedBigInteger('category_id');

            $table->string('location_lost');

            $table->date('date_lost');

            $table->string('image')->nullable();

            $table->enum('status', [
                'lost',
                'found',
                'claimed',
                'verified',
                'returned',
                'rejected',
                'closed',
            ])->default('lost');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lost_items');
    }
};
