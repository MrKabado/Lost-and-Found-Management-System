<?php

use App\Models\Category;
use App\Models\LostItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('allows a user to create, view, update, and delete their own lost item', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Electronics']);

    $response = $this->actingAs($user, 'sanctum')->postJson('/lost-items', [
        'category_id' => $category->id,
        'title' => 'Blue headphones',
        'description' => 'Over-ear headphones with a blue case.',
        'location_lost' => 'Library',
        'date_lost' => '2026-09-10',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('title', 'Blue headphones')
        ->assertJsonPath('status', 'lost');

    $lostItem = LostItem::firstOrFail();

    $this->actingAs($user, 'sanctum')
        ->getJson('/lost-items')
        ->assertOk()
        ->assertJsonCount(1);

    $this->actingAs($user, 'sanctum')
        ->getJson("/lost-items/{$lostItem->id}")
        ->assertOk()
        ->assertJsonPath('id', $lostItem->id);

    $this->actingAs($user, 'sanctum')
        ->putJson("/lost-items/{$lostItem->id}", [
            'title' => 'Blue headphones case',
            'status' => 'found',
        ])
        ->assertOk()
        ->assertJsonPath('title', 'Blue headphones case')
        ->assertJsonPath('status', 'found');

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/lost-items/{$lostItem->id}")
        ->assertOk()
        ->assertJson(['message' => 'Lost item deleted successfully.']);

    expect(LostItem::find($lostItem->id))->toBeNull();
});

it('prevents users from managing another users lost item', function () {
    /** @var TestCase $this */
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $category = Category::create(['name' => 'Wallet']);
    $lostItem = LostItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Black wallet',
        'description' => 'Leather wallet.',
        'location_lost' => 'Cafeteria',
        'date_lost' => '2026-09-10',
    ]);

    $this->actingAs($otherUser, 'sanctum')
        ->getJson("/lost-items/{$lostItem->id}")
        ->assertForbidden();

    $this->actingAs($otherUser, 'sanctum')
        ->deleteJson("/lost-items/{$lostItem->id}")
        ->assertForbidden();
});

it('allows admins to view all lost items and delete invalid reports', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Bag']);
    $lostItem = LostItem::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'title' => 'Red bag',
        'description' => 'A red backpack.',
        'location_lost' => 'Gym',
        'date_lost' => '2026-09-10',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->getJson('/admin/lost-items')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Red bag');

    $this->actingAs($admin, 'sanctum')
        ->deleteJson("/admin/lost-items/{$lostItem->id}")
        ->assertOk();

    expect(LostItem::find($lostItem->id))->toBeNull();
});

it('rejects statuses outside the lost item workflow', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Others']);

    $this->actingAs($user, 'sanctum')
        ->postJson('/lost-items', [
            'category_id' => $category->id,
            'title' => 'Unknown item',
            'description' => 'Description',
            'location_lost' => 'Hallway',
            'date_lost' => '2026-09-10',
            'status' => 'claimed',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});
