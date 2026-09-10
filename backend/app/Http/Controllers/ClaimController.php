<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\FoundItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Claim::with(['foundItem.category', 'foundItem.user'])
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request, FoundItem $foundItem): JsonResponse
    {
        if ($foundItem->user_id === $request->user()->id) {
            abort(403, 'You cannot claim your own found item.');
        }

        $validated = $request->validate([
            'claim_reason' => ['required', 'string', 'max:5000'],
            'proof' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('proof')) {
            $validated['proof'] = $request->file('proof')->store('claim-proofs', 'public');
        }

        $alreadyClaimed = Claim::query()
            ->where('found_item_id', $foundItem->id)
            ->where('user_id', $request->user()->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($alreadyClaimed) {
            return response()->json([
                'message' => 'You already have an active claim for this item.',
            ], 422);
        }

        $claim = $request->user()->claims()->create([
            ...$validated,
            'found_item_id' => $foundItem->id,
        ]);

        return response()->json($claim->refresh()->load('foundItem.category'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Claim $claim): JsonResponse
    {
        abort_unless($claim->user_id === $request->user()->id, 403);

        return response()->json($claim->load('foundItem.category'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function adminIndex(): JsonResponse
    {
        return response()->json(Claim::with(['user', 'foundItem.category', 'foundItem.user'])->latest()->get());
    }

    public function adminShow(Claim $claim): JsonResponse
    {
        return response()->json($claim->load(['user', 'foundItem.category', 'foundItem.user']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function approve(Claim $claim): JsonResponse
    {
        if ($claim->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending claims can be approved.',
            ], 422);
        }

        $claim->update(['status' => 'approved']);
        $claim->foundItem()->update(['status' => 'claimed']);

        return response()->json($claim->refresh()->load('foundItem.category'));
    }

    public function reject(Claim $claim): JsonResponse
    {
        if ($claim->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending claims can be rejected.',
            ], 422);
        }

        $claim->update(['status' => 'rejected']);

        return response()->json($claim->refresh()->load('foundItem.category'));
    }
}
