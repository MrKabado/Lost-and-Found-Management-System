<?php

namespace App\Http\Controllers;

use App\Models\FoundItem;
use App\Models\LostItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemStatusController extends Controller
{
    public function updateLost(Request $request, LostItem $lostItem): JsonResponse
    {
        return $this->updateStatus($request, $lostItem);
    }

    public function updateFound(Request $request, FoundItem $foundItem): JsonResponse
    {
        return $this->updateStatus($request, $foundItem);
    }

    private function updateStatus(Request $request, LostItem|FoundItem $item): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:lost,found,claimed,verified,returned,rejected,closed'],
        ]);

        $allowedStatuses = [
            'lost' => ['found', 'rejected', 'closed'],
            'found' => ['claimed', 'rejected', 'closed'],
            'claimed' => ['verified', 'rejected', 'closed'],
            'verified' => ['returned', 'rejected', 'closed'],
            'returned' => [],
            'rejected' => ['closed'],
            'closed' => [],
        ];

        $nextStatus = $validated['status'];

        if (! in_array($nextStatus, $allowedStatuses[$item->status] ?? [], true)) {
            return response()->json([
                'message' => "Cannot change item status from {$item->status} to {$nextStatus}.",
            ], 422);
        }

        $item->update(['status' => $nextStatus]);

        return response()->json($item->refresh()->load('category'));
    }
}
