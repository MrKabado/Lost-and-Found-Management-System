<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public function sendToUser(
        int $userId,
        string $title,
        string $message,
        string $type,
        ?string $relatedType = null,
        ?int $relatedId = null,
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'related_type' => $relatedType,
            'related_id' => $relatedId,
        ]);
    }
}
