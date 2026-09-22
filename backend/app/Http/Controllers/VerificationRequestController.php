<?php

namespace App\Http\Controllers;

use App\Models\VerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->verificationRequests()->with('reviewer')->latest()->first()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->studentProfile()->exists()) {
            return response()->json([
                'message' => 'Complete your student profile before requesting verification.',
            ], 422);
        }

        if ($user->verificationRequests()->where('status', 'pending')->exists()) {
            return response()->json([
                'message' => 'You already have a pending verification request.',
            ], 422);
        }

        if ($user->is_verified) {
            return response()->json([
                'message' => 'Your account is already verified.',
            ], 422);
        }

        $validated = $request->validate([
            'school_id_image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
            'supporting_document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ]);

        $validated['school_id_image'] = $request->file('school_id_image')->store('verification/school-ids', 'public');
        if ($request->hasFile('supporting_document')) {
            $validated['supporting_document'] = $request->file('supporting_document')->store('verification/supporting-documents', 'public');
        }

        $verificationRequest = $user->verificationRequests()->create($validated);

        return response()->json($verificationRequest->load('reviewer'), 201);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,approved,rejected'],
        ]);

        $query = VerificationRequest::with(['user.studentProfile.course', 'reviewer'])->latest();
        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        return response()->json($query->get());
    }

    public function adminShow(VerificationRequest $verificationRequest): JsonResponse
    {
        return response()->json($verificationRequest->load([
            'user.studentProfile.course',
            'reviewer',
        ]));
    }

    public function approve(Request $request, VerificationRequest $verificationRequest): JsonResponse
    {
        if ($verificationRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be approved.'], 422);
        }

        $verificationRequest->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);
        $verificationRequest->user()->update(['is_verified' => true]);

        return response()->json($verificationRequest->refresh()->load([
            'user.studentProfile.course',
            'reviewer',
        ]));
    }

    public function reject(Request $request, VerificationRequest $verificationRequest): JsonResponse
    {
        if ($verificationRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be rejected.'], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:5000'],
        ]);

        $verificationRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json($verificationRequest->refresh()->load([
            'user.studentProfile.course',
            'reviewer',
        ]));
    }
}
