<?php

namespace App\Http\Controllers;

use App\Models\LostItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LostItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            LostItem::with('category')
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
            'location_lost' => ['required', 'string', 'max:255'],
            'date_lost' => ['required', 'date'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', 'in:lost'],
        ]);

        $lostItem = $request->user()->lostItems()->create($validated);

        return response()->json($lostItem->refresh()->load('category'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, LostItem $lostItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $lostItem);

        return response()->json($lostItem->load('category'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, LostItem $lostItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $lostItem);

        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'location_lost' => ['sometimes', 'string', 'max:255'],
            'date_lost' => ['sometimes', 'date'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', 'in:lost,found,claimed,verified,returned,rejected,closed'],
        ]);

        $lostItem->update($validated);

        return response()->json($lostItem->refresh()->load('category'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, LostItem $lostItem): JsonResponse
    {
        $this->ensureOwner($request->user(), $lostItem);
        $lostItem->delete();

        return response()->json([
            'message' => 'Lost item deleted successfully.',
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json(LostItem::with(['user', 'category'])->latest()->get());
    }

    public function adminDestroy(LostItem $lostItem): JsonResponse
    {
        $lostItem->delete();

        return response()->json([
            'message' => 'Lost item deleted successfully.',
        ]);
    }

    private function ensureOwner(User $user, LostItem $lostItem): void
    {
        abort_unless($lostItem->user_id === $user->id, 403, 'You can only manage your own lost items.');
    }
}
