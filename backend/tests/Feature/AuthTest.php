<?php

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

it('registers, authenticates, returns, and logs out a user with a Sanctum token', function () {
    /** @var TestCase $this */
    $registration = $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $registration
        ->assertCreated()
        ->assertJsonPath('user.email', 'jane@example.com')
        ->assertJsonPath('user.role', 'user')
        ->assertJsonStructure(['user', 'token']);

    $login = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $login->assertOk()->assertJsonStructure(['user', 'token']);
    $token = $login->json('token');

    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('email', 'jane@example.com');

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout')
        ->assertOk()
        ->assertJson(['message' => 'Logged out successfully.']);

    $this->app['auth']->forgetGuards();

    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/user')
        ->assertUnauthorized();
});

it('rejects invalid login credentials', function () {
    /** @var TestCase $this */
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'wrong-password',
    ])->assertUnprocessable()->assertJsonValidationErrors('email');
});

it('records the login time and calculates activity status dynamically', function () {
    /** @var TestCase $this */
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password',
        'last_login_at' => Carbon::now()->subDays(120),
    ]);

    expect($user->activity_status)->toBe('inactive');

    $login = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $login->assertOk()
        ->assertJsonPath('user.activity_status', 'active')
        ->assertJsonPath('user.account_status', 'active')
        ->assertJsonPath('user.last_login_at', fn ($value): bool => is_string($value));

    expect($user->fresh()->last_login_at)->not->toBeNull();
});

it('blocks deactivated accounts before issuing a token', function () {
    /** @var TestCase $this */
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password',
        'account_status' => 'deactivated',
    ]);

    $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'password',
    ])->assertForbidden()->assertJson([
        'message' => 'Your account has been deactivated. Please contact an administrator.',
    ])->assertJsonMissingPath('token');
});

it('changes the authenticated user password after checking the current password', function () {
    /** @var TestCase $this */
    $user = User::factory()->create(['password' => 'old-password']);

    $this->actingAs($user, 'sanctum')
        ->patchJson('/api/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertUnprocessable()
        ->assertJson(['message' => 'The current password is incorrect.']);

    expect(password_verify('old-password', $user->fresh()->password))->toBeTrue();

    $this->actingAs($user, 'sanctum')
        ->patchJson('/api/password', [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertOk()
        ->assertJson(['message' => 'Password changed successfully.']);

    expect(password_verify('new-password', $user->fresh()->password))->toBeTrue();
});
