<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('lists the seeded categories', function () {
    /** @var TestCase $this */
    $this->seed();

    $this->getJson('/api/categories')
        ->assertOk()
        ->assertJsonCount(6)
        ->assertJsonFragment(['name' => 'Electronics'])
        ->assertJsonFragment(['name' => 'Others']);
});

it('allows an admin to create, update, and delete a category', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();

    $this->actingAs($admin, 'sanctum')
        ->postJson('/api/categories', ['name' => 'Phone Accessories'])
        ->assertCreated()
        ->assertJsonPath('name', 'Phone Accessories');

    $category = Category::where('name', 'Phone Accessories')->firstOrFail();

    $this->actingAs($admin, 'sanctum')
        ->putJson("/api/categories/{$category->id}", ['name' => 'Accessories'])
        ->assertOk()
        ->assertJsonPath('name', 'Accessories');

    $this->actingAs($admin, 'sanctum')
        ->deleteJson("/api/categories/{$category->id}")
        ->assertOk()
        ->assertJson(['message' => 'Category deleted successfully.']);

    expect(Category::find($category->id))->toBeNull();
});

it('rejects category changes from non-admin users', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/categories', ['name' => 'Restricted'])
        ->assertForbidden();
});
