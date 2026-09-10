<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\FoundItem;
use App\Models\LostItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function statistics(): JsonResponse
    {
        return response()->json([
            'total_users' => User::count(),
            'total_lost_items' => LostItem::count(),
            'total_found_items' => FoundItem::count(),
            'pending_claims' => Claim::where('status', 'pending')->count(),
            'returned_items' => LostItem::where('status', 'returned')->count()
                + FoundItem::where('status', 'returned')->count(),
        ]);
    }
}
