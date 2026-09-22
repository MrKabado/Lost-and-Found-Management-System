<?php

namespace App\Http\Controllers;

use App\Models\FoundItem;
use App\Models\LostItem;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemStatusController extends Controller
{
    public function updateLost(Request $request, LostItem $lostItem, NotificationService $notificationService): JsonResponse
    {
        return $this->updateStatus($request, $lostItem, $notificationService);
    }

    public function updateFound(Request $request, FoundItem $foundItem, NotificationService $notificationService): JsonResponse
    {
        return $this->updateStatus($request, $foundItem, $notificationService);
    }

    private function updateStatus(Request $request, LostItem|FoundItem $item, NotificationService $notificationService): JsonResponse
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

        if (($item instanceof LostItem && $nextStatus === 'found') || ($item instanceof FoundItem && $nextStatus === 'verified')) {
            $reportType = $item instanceof LostItem ? 'lost_item' : 'found_item';
            $reportLabel = $item instanceof LostItem ? 'Lost' : 'Found';
            $notificationService->sendToUser($item->user_id, "{$reportLabel} Report Approved", "Your {$reportLabel} item report for \"{$item->title}\" has been approved.", $reportType, $reportType, $item->id);
        }

        return response()->json($item->refresh()->load('category'));
    }
}
