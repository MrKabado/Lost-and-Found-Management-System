<?php

use App\Models\Category;
use App\Models\FoundItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('tracks an item through the lifecycle', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create(['role' => 'admin']);
    $owner = User::factory()->create();
    $category = Category::create(['name' => 'Wallet']);
    $item = FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Black wallet',
        'description' => 'A wallet.',
        'location_found' => 'Library',
        'date_found' => '2026-09-10',
    ]);

    foreach (['claimed', 'verified', 'returned'] as $status) {
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/admin/found-items/{$item->id}/status", ['status' => $status])
            ->assertOk()
            ->assertJsonPath('status', $status);
    }
});

it('supports rejection followed by closure', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create(['role' => 'admin']);
    $owner = User::factory()->create();
    $category = Category::create(['name' => 'Bag']);
    $item = FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Red bag',
        'description' => 'A bag.',
        'location_found' => 'Gym',
        'date_found' => '2026-09-10',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->patchJson("/admin/found-items/{$item->id}/status", ['status' => 'rejected'])
        ->assertOk()
        ->assertJsonPath('status', 'rejected');

    $this->actingAs($admin, 'sanctum')
        ->patchJson("/admin/found-items/{$item->id}/status", ['status' => 'closed'])
        ->assertOk()
        ->assertJsonPath('status', 'closed');
});

it('rejects invalid status transitions', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create(['role' => 'admin']);
    $owner = User::factory()->create();
    $category = Category::create(['name' => 'Others']);
    $item = FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Book',
        'description' => 'A book.',
        'location_found' => 'Hallway',
        'date_found' => '2026-09-10',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->patchJson("/admin/found-items/{$item->id}/status", ['status' => 'returned'])
        ->assertUnprocessable();
});
