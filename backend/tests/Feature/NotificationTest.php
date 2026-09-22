<?php

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('lists notifications and marks details as read', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $user->id,
        'title' => 'Claim Approved',
        'message' => 'Your claim was approved.',
        'type' => 'claim',
        'related_type' => 'claim',
        'related_id' => 15,
    ]);

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/notifications/count')
        ->assertOk()
        ->assertJson(['count' => 1]);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/notifications/{$notification->id}")
        ->assertOk()
        ->assertJsonPath('is_read', true)
        ->assertJsonPath('navigation_url', '/client/claims/15');
});

it('prevents users from reading another users notification', function () {
    /** @var TestCase $this */
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $owner->id,
        'title' => 'Private notice',
        'message' => 'Private message.',
        'type' => 'system',
    ]);

    $this->actingAs($otherUser, 'sanctum')
        ->getJson("/api/notifications/{$notification->id}")
        ->assertForbidden();
});
