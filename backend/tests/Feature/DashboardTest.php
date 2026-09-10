<?php

use App\Models\Category;
use App\Models\Claim;
use App\Models\FoundItem;
use App\Models\LostItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('returns dashboard statistics for admins', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Wallet']);

    LostItem::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'title' => 'Lost wallet',
        'description' => 'A wallet.',
        'location_lost' => 'Library',
        'date_lost' => '2026-09-10',
    ]);

    $foundItem = FoundItem::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'title' => 'Found phone',
        'description' => 'A phone.',
        'location_found' => 'Cafeteria',
        'date_found' => '2026-09-10',
        'status' => 'returned',
    ]);

    Claim::create([
        'user_id' => $user->id,
        'found_item_id' => $foundItem->id,
        'claim_reason' => 'It belongs to me.',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->getJson('/admin/dashboard/statistics')
        ->assertOk()
        ->assertExactJson([
            'total_users' => 2,
            'total_lost_items' => 1,
            'total_found_items' => 1,
            'pending_claims' => 1,
            'returned_items' => 1,
        ]);
});

it('rejects dashboard statistics for non-admin users', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson('/admin/dashboard/statistics')
        ->assertForbidden();
});
