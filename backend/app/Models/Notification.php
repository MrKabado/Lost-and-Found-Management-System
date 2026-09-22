<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'title', 'message', 'type', 'is_read', 'related_type', 'related_id',
    ];

    protected function casts(): array
    {
        return ['is_read' => 'boolean'];
    }

    protected $appends = ['navigation_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getNavigationUrlAttribute(): ?string
    {
        if (! $this->related_type || ! $this->related_id) {
            return null;
        }

        return match ($this->related_type) {
            'claim' => "/client/claims/{$this->related_id}",
            'lost_item' => "/client/lost-reports/{$this->related_id}",
            'found_item' => "/client/found-reports/{$this->related_id}",
            'verification' => '/client/profile',
            default => null,
        };
    }
}
