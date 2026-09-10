<?php

use App\Models\Category;
use App\Models\Claim;
use App\Models\FoundItem;
use App\Models\LostItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('uploads lost and found item images to public storage', function () {
    /** @var TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Electronics']);

    $lostResponse = $this->actingAs($user, 'sanctum')->post('/lost-items', [
        'category_id' => $category->id,
        'title' => 'Lost camera',
        'description' => 'A camera.',
        'location_lost' => 'Library',
        'date_lost' => '2026-09-10',
        'image' => UploadedFile::fake()->create('lost-camera.jpg', 100, 'image/jpeg'),
    ]);

    $lostResponse->assertCreated();
    $lostItem = LostItem::firstOrFail();
    expect(Storage::disk('public')->exists($lostItem->image))->toBeTrue();
    expect($lostItem->image)->toStartWith('lost-items/');

    $foundResponse = $this->actingAs($user, 'sanctum')->post('/found-items', [
        'category_id' => $category->id,
        'title' => 'Found phone',
        'description' => 'A phone.',
        'location_found' => 'Cafeteria',
        'date_found' => '2026-09-10',
        'image' => UploadedFile::fake()->create('found-phone.png', 100, 'image/png'),
    ]);

    $foundResponse->assertCreated();
    $foundItem = FoundItem::firstOrFail();
    expect(Storage::disk('public')->exists($foundItem->image))->toBeTrue();
    expect($foundItem->image)->toStartWith('found-items/');
});

it('uploads claim proof images to public storage', function () {
    /** @var TestCase $this */
    Storage::fake('public');
    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $category = Category::create(['name' => 'Wallet']);
    $foundItem = FoundItem::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Found wallet',
        'description' => 'A wallet.',
        'location_found' => 'Library',
        'date_found' => '2026-09-10',
    ]);

    $this->actingAs($claimant, 'sanctum')
        ->post("/found-items/{$foundItem->id}/claims", [
            'claim_reason' => 'I believe this wallet belongs to me.',
            'proof' => UploadedFile::fake()->create('wallet-proof.jpg', 100, 'image/jpeg'),
        ])
        ->assertCreated();

    $claim = Claim::firstOrFail();
    expect(Storage::disk('public')->exists($claim->proof))->toBeTrue();
    expect($claim->proof)->toStartWith('claim-proofs/');
});

it('deletes the old item image when replaced', function () {
    /** @var TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Bag']);

    $this->actingAs($user, 'sanctum')->post('/lost-items', [
        'category_id' => $category->id,
        'title' => 'Lost bag',
        'description' => 'A bag.',
        'location_lost' => 'Gym',
        'date_lost' => '2026-09-10',
        'image' => UploadedFile::fake()->create('old-bag.jpg', 100, 'image/jpeg'),
    ])->assertCreated();

    $lostItem = LostItem::firstOrFail();
    $oldImage = $lostItem->image;

    $this->actingAs($user, 'sanctum')
        ->put("/lost-items/{$lostItem->id}", [
            'image' => UploadedFile::fake()->create('new-bag.jpg', 100, 'image/jpeg'),
        ])
        ->assertOk();

    $newImage = $lostItem->refresh()->image;
    expect(Storage::disk('public')->exists($oldImage))->toBeFalse();
    expect(Storage::disk('public')->exists($newImage))->toBeTrue();
});
