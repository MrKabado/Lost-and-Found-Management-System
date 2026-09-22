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
            'status' => ['required', 'in:available,awaiting_pickup,returned,unclaimed,archived'],
        ]);

        $allowedStatuses = [
            'available' => ['awaiting_pickup', 'unclaimed'],
            'awaiting_pickup' => ['returned'],
            'returned' => [],
            'unclaimed' => ['archived'],
            'archived' => ['available'],
        ];

        $nextStatus = $validated['status'];

        if (! in_array($nextStatus, $allowedStatuses[$item->status] ?? [], true)) {
            return response()->json([
                'message' => "Cannot change item status from {$item->status} to {$nextStatus}.",
            ], 422);
        }

        $item->update(['status' => $nextStatus]);

        if ($nextStatus === 'available') {
            $reportType = $item instanceof LostItem ? 'lost_item' : 'found_item';
            $reportLabel = $item instanceof LostItem ? 'Lost' : 'Found';
            $notificationService->sendToUser($item->user_id, "{$reportLabel} Report Approved", "Your {$reportLabel} item report for \"{$item->title}\" has been approved.", $reportType, $reportType, $item->id);
        }

        return response()->json($item->refresh()->load('category'));
    }
}
