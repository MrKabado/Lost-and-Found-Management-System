<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->notifications()->latest()->get());
    }

    public function unread(Request $request): JsonResponse
    {
        return response()->json($request->user()->notifications()->where('is_read', false)->latest()->get());
    }

    public function count(Request $request): JsonResponse
    {
        return response()->json(['count' => $request->user()->notifications()->where('is_read', false)->count()]);
    }

    public function show(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        $notification->update(['is_read' => true]);

        return response()->json($notification->refresh());
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        $notification->update(['is_read' => true]);

        return response()->json($notification->refresh());
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->where('is_read', false)->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function store(Request $request, NotificationService $notificationService): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
            'type' => ['required', 'in:verification,claim,lost_item,found_item,announcement,system'],
            'related_type' => ['nullable', 'string', 'max:255'],
            'related_id' => ['nullable', 'integer'],
        ]);

        $notification = $notificationService->sendToUser(
            $validated['user_id'],
            $validated['title'],
            $validated['message'],
            $validated['type'],
            $validated['related_type'] ?? null,
            $validated['related_id'] ?? null,
        );

        return response()->json($notification, 201);
    }
}
