<?php

use App\Models\Category;
use App\Models\FoundItem;
use App\Models\LostItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Category::create(['name' => 'Wallet']);
    Category::create(['name' => 'Electronics']);
    $user = User::factory()->create();

    LostItem::create([
        'user_id' => $user->id,
        'category_id' => Category::where('name', 'Wallet')->value('id'),
        'title' => 'Black wallet',
        'description' => 'Leather wallet with cards.',
        'location_lost' => 'Library',
        'date_lost' => '2026-09-09',
        'status' => 'lost',
    ]);

    FoundItem::create([
        'user_id' => $user->id,
        'category_id' => Category::where('name', 'Electronics')->value('id'),
        'title' => 'Blue headphones',
        'description' => 'Wireless headphones.',
        'location_found' => 'Cafeteria',
        'date_found' => '2026-09-10',
        'status' => 'found',
    ]);
});

it('searches items by keyword', function () {
    /** @var TestCase $this */
    $this->getJson('/api/items?search=wallet')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Black wallet')
        ->assertJsonPath('0.type', 'lost');
});

it('filters items by category, date, location, and status', function () {
    /** @var TestCase $this */
    $this->getJson('/api/items?category=electronics')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Blue headphones');

    $this->getJson('/api/items?date=2026-09-09')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Black wallet');

    $this->getJson('/api/items?location=cafeteria')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Blue headphones');

    $this->getJson('/api/items?status=lost')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Black wallet');
});

it('combines filters and rejects invalid filter values', function () {
    /** @var TestCase $this */
    $this->getJson('/api/items?search=headphones&category=electronics&status=found')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Blue headphones');

    $this->getJson('/api/items?status=invalid')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});
