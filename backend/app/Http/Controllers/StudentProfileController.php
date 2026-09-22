<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('studentProfile.course')->studentProfile);
    }

    public function store(Request $request): JsonResponse
    {
        return $this->save($request, ! $request->user()->studentProfile()->exists());
    }

    public function update(Request $request): JsonResponse
    {
        if (! $request->user()->studentProfile()->exists()) {
            return response()->json(['message' => 'Create your student profile first.'], 404);
        }

        return $this->save($request, false);
    }

    private function save(Request $request, bool $creating): JsonResponse
    {
        $validated = $request->validate([
            'school_id' => ['required', 'string', 'max:255'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'contact_number' => ['required', 'string', 'max:50'],
            'profile_image' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $profile = $request->user()->studentProfile()->first();
        if ($request->hasFile('profile_image')) {
            if ($profile?->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }
            $validated['profile_image'] = $request->file('profile_image')->store('profile-images', 'public');
        }

        $profile = $creating
            ? $request->user()->studentProfile()->create($validated)
            : tap($profile)->update($validated);

        return response()->json($profile->refresh()->load('course'), $creating ? 201 : 200);
    }
}
