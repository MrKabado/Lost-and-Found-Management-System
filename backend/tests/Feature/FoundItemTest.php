<?php

use App\Models\Category;
use App\Models\FoundItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('allows a user to create, view, update, and delete their own found item', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Electronics']);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/found-items', [
            'category_id' => $category->id,
            'title' => 'Black umbrella',
            'description' => 'A black umbrella found near the entrance.',
            'location_found' => 'Main entrance',
            'date_found' => '2026-09-10',
        ])
        ->assertCreated()
        ->assertJsonPath('title', 'Black umbrella')
        ->assertJsonPath('status', 'found');

    $foundItem = FoundItem::firstOrFail();

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/found-items')
        ->assertOk()
        ->assertJsonCount(1);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/found-items/{$foundItem->id}")
        ->assertOk()
        ->assertJsonPath('id', $foundItem->id);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/found-items/{$foundItem->id}", [
            'title' => 'Black umbrella with strap',
            'status' => 'claimed',
        ])
        ->assertOk()
        ->assertJsonPath('title', 'Black umbrella with strap')
        ->assertJsonPath('status', 'claimed');

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/found-items/{$foundItem->id}")
        ->assertOk()
        ->assertJson(['message' => 'Found item deleted successfully.']);

    expect(FoundItem::find($foundItem->id))->toBeNull();
});

it('prevents users from managing another users found item', function () {
    /** @var TestCase $this */
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $category = Category::create(['name' => 'Wallet']);
    $foundItem = FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Brown wallet',
        'description' => 'A leather wallet.',
        'location_found' => 'Cafeteria',
        'date_found' => '2026-09-10',
    ]);

    $this->actingAs($otherUser, 'sanctum')
        ->getJson("/api/found-items/{$foundItem->id}")
        ->assertForbidden();

    $this->actingAs($otherUser, 'sanctum')
        ->deleteJson("/api/found-items/{$foundItem->id}")
        ->assertForbidden();
});

it('allows admins to view all found items', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Bag']);
    FoundItem::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'title' => 'Green backpack',
        'description' => 'A green backpack.',
        'location_found' => 'Gym',
        'date_found' => '2026-09-10',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->getJson('/api/admin/found-items')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Green backpack');
});

it('rejects invalid found item statuses', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Others']);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/found-items', [
            'category_id' => $category->id,
            'title' => 'Unknown item',
            'description' => 'Description',
            'location_found' => 'Hallway',
            'date_found' => '2026-09-10',
            'status' => 'lost',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});
