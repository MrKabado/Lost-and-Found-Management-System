<?php

use App\Models\Category;
use App\Models\Claim;
use App\Models\FoundItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

function createFoundItemForClaim(User $owner): FoundItem
{
    $category = Category::firstOrCreate(['name' => 'Wallet']);

    return FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Black wallet',
        'description' => 'A leather wallet found in the library.',
        'location_found' => 'Library',
        'date_found' => '2026-09-10',
    ]);
}

it('allows a user to submit and view a claim for a found item', function () {
    /** @var TestCase $this */
    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $foundItem = createFoundItemForClaim($owner);

    $this->actingAs($claimant, 'sanctum')
        ->postJson("/api/found-items/{$foundItem->id}/claims", [
            'claim_reason' => 'I believe this wallet belongs to me.',
        ])
        ->assertCreated()
        ->assertJsonPath('status', 'pending')
        ->assertJsonPath('found_item_id', $foundItem->id);

    $this->actingAs($claimant, 'sanctum')
        ->getJson('/api/claims')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.claim_reason', 'I believe this wallet belongs to me.');
});

it('prevents self claims and duplicate active claims', function () {
    /** @var TestCase $this */
    $owner = User::factory()->create();
    $foundItem = createFoundItemForClaim($owner);

    $this->actingAs($owner, 'sanctum')
        ->postJson("/api/found-items/{$foundItem->id}/claims", [
            'claim_reason' => 'This is mine.',
        ])
        ->assertForbidden();

    $claimant = User::factory()->create();
    $this->actingAs($claimant, 'sanctum')
        ->postJson("/api/found-items/{$foundItem->id}/claims", [
            'claim_reason' => 'First claim.',
        ])
        ->assertCreated();

    $this->actingAs($claimant, 'sanctum')
        ->postJson("/api/found-items/{$foundItem->id}/claims", [
            'claim_reason' => 'Duplicate claim.',
        ])
        ->assertUnprocessable();
});

it('allows admins to view, approve, and reject claims', function () {
    /** @var TestCase $this */
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();
    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $foundItem = createFoundItemForClaim($owner);
    $claim = Claim::create([
        'user_id' => $claimant->id,
        'found_item_id' => $foundItem->id,
        'claim_reason' => 'This wallet belongs to me.',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->getJson('/api/admin/claims')
        ->assertOk()
        ->assertJsonCount(1);

    $this->actingAs($admin, 'sanctum')
        ->getJson("/api/admin/claims/{$claim->id}")
        ->assertOk()
        ->assertJsonPath('claim_reason', 'This wallet belongs to me.')
        ->assertJsonPath('user.id', $claimant->id)
        ->assertJsonPath('found_item.user.id', $owner->id)
        ->assertJsonPath('found_item.category.name', 'Wallet');

    $this->actingAs($admin, 'sanctum')
        ->postJson("/api/admin/claims/{$claim->id}/approve")
        ->assertOk()
        ->assertJsonPath('status', 'approved');

    expect($foundItem->refresh()->status)->toBe('claimed');

    $secondFoundItem = createFoundItemForClaim($owner);
    $secondClaim = Claim::create([
        'user_id' => $claimant->id,
        'found_item_id' => $secondFoundItem->id,
        'claim_reason' => 'Another item belongs to me.',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->postJson("/api/admin/claims/{$secondClaim->id}/reject")
        ->assertOk()
        ->assertJsonPath('status', 'rejected');
});
