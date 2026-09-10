<?php

namespace App\Http\Controllers;

use App\Models\FoundItem;
use App\Models\LostItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'date' => ['sometimes', 'date'],
            'location' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'in:lost,found,claimed,closed'],
        ]);

        $lostItems = $this->queryItems(LostItem::query(), $validated, 'lost');
        $foundItems = $this->queryItems(FoundItem::query(), $validated, 'found');

        return response()->json(
            $lostItems->merge($foundItems)
                ->sortByDesc(fn (array $item) => $item['created_at'])
                ->values()
        );
    }

    private function queryItems(Builder $query, array $filters, string $type): Collection
    {
        $locationColumn = $type === 'lost' ? 'location_lost' : 'location_found';
        $dateColumn = $type === 'lost' ? 'date_lost' : 'date_found';

        $query->with('category');

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['category'])) {
            $query->whereHas('category', function ($query) use ($filters): void {
                $query->where('name', 'like', "%{$filters['category']}%");
            });
        }

        if (isset($filters['date'])) {
            $query->whereDate($dateColumn, $filters['date']);
        }

        if (isset($filters['location'])) {
            $query->where($locationColumn, 'like', "%{$filters['location']}%");
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return collect($query->latest()->get()->map(function ($item) use ($type, $locationColumn, $dateColumn): array {
            return [
                'id' => $item->id,
                'type' => $type,
                'user_id' => $item->user_id,
                'category' => $item->category,
                'title' => $item->title,
                'description' => $item->description,
                'location' => $item->{$locationColumn},
                'date' => $item->{$dateColumn},
                'image' => $item->image,
                'status' => $item->status,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        })->all());
    }
}
