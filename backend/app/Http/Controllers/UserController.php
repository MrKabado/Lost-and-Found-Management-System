<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'string', 'max:255'],
            'verification_status' => ['sometimes', 'in:verified,unverified'],
            'activity_status' => ['sometimes', 'in:active,inactive'],
            'account_status' => ['sometimes', 'in:active,deactivated'],
        ]);

        $query = User::query()
            ->with('studentProfile')
            ->select(['id', 'name', 'email', 'role', 'is_verified', 'account_status', 'last_login_at', 'created_at']);

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($userQuery) use ($search): void {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        if (($validated['verification_status'] ?? null) === 'verified') {
            $query->where('is_verified', true);
        } elseif (($validated['verification_status'] ?? null) === 'unverified') {
            $query->where('is_verified', false);
        }

        if (($validated['account_status'] ?? null) !== null) {
            $query->where('account_status', $validated['account_status']);
        }

        $users = $query->latest()->get();

        if (($validated['activity_status'] ?? null) !== null) {
            $users = $users->filter(fn (User $user): bool => $user->activity_status === $validated['activity_status'])->values();
        }

        return response()->json($users);
    }

    public function deactivate(User $user): JsonResponse
    {
        $user->update(['account_status' => 'deactivated']);

        return response()->json($user->refresh()->load('studentProfile'));
    }

    public function reactivate(User $user): JsonResponse
    {
        $user->update(['account_status' => 'active']);

        return response()->json($user->refresh()->load('studentProfile'));
    }
}
