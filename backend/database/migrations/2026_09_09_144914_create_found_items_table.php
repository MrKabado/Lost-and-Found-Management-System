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
        Schema::create('found_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedBigInteger('category_id');

            $table->string('title');
            $table->text('description');

            $table->string('location_found');

            $table->date('date_found');

            $table->string('image')->nullable();

            $table->enum('status', [
                'lost',
                'found',
                'claimed',
                'verified',
                'returned',
                'rejected',
                'closed',
            ])->default('found');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('found_items');
    }
};
