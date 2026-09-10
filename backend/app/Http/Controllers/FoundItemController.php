<?php

namespace App\Http\Controllers;

use App\Models\FoundItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoundItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            FoundItem::with('category')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_found' => ['required', 'string', 'max:255'],
            'date_found' => ['required', 'date'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', 'in:found,claimed,closed'],
        ]);

        $foundItem = $request->user()->foundItems()->create($validated);

        return response()->json($foundItem->refresh()->load('category'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, FoundItem $foundItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $foundItem);

        return response()->json($foundItem->load('category'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, FoundItem $foundItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $foundItem);

        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'location_found' => ['sometimes', 'string', 'max:255'],
            'date_found' => ['sometimes', 'date'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', 'in:found,claimed,closed'],
        ]);

        $foundItem->update($validated);

        return response()->json($foundItem->refresh()->load('category'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, FoundItem $foundItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $foundItem);
        $foundItem->delete();

        return response()->json([
            'message' => 'Found item deleted successfully.',
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json(FoundItem::with(['user', 'category'])->latest()->get());
    }

    private function ensureOwner(User $user, FoundItem $foundItem): void
    {
        abort_unless($foundItem->user_id === $user->id, 403, 'You can only manage your own found items.');
    }
}
