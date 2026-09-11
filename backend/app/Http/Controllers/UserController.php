<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function adminIndex(): JsonResponse
    {
        return response()->json(
            User::query()
                ->select(['id', 'name', 'email', 'role', 'created_at'])
                ->latest()
                ->get()
        );
    }
}
