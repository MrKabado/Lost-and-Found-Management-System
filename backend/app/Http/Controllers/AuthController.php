<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create($validated);
        $user->refresh()->load('studentProfile');

        return response()->json([
            'user' => $user->load('studentProfile'),
            'token' => $user->createToken('auth-token')->plainTextToken,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->account_status === 'deactivated') {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact an administrator.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'user' => $user->refresh(),
            'token' => $user->createToken('auth-token')->plainTextToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($token = $request->bearerToken()) {
            PersonalAccessToken::findToken($token)?->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('studentProfile'));
    }

    public function sendRegisterOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json([
                'message' => 'Email is already registered.',
            ], 409);
        }

        return $this->sendOtpToEmail($request->email);
    }

    public function sendForgotPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'message' => 'No account found with this email.',
            ], 404);
        }

        return $this->sendOtpToEmail($request->email);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json([
                'message' => 'No account found with this email.',
            ], 404);
        }

        $otpRecord = Otp::where('email', $validated['email'])
            ->where('otp', $validated['otp'])
            ->first();

        if (! $otpRecord) {
            return response()->json([
                'message' => 'Invalid OTP',
            ], 422);
        }

        if ($otpRecord->expires_at->isPast()) {
            $otpRecord->delete();

            return response()->json([
                'message' => 'OTP has expired',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);
        $otpRecord->delete();

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }

    public function sendOtpToEmail(string $email)
    {
        $lockKey = 'otp-send:'.hash('sha256', strtolower(trim($email)));

        return Cache::lock($lockKey, 10)->block(5, function () use ($email) {
            $existingOtp = Otp::where('email', $email)->first();

            if ($existingOtp && $existingOtp->last_sent_at) {
                $secondsSinceLastSend = now()->diffInSeconds($existingOtp->last_sent_at);

                if ($secondsSinceLastSend < 60) {
                    $remaining = 60 - $secondsSinceLastSend;

                    return response()->json([
                        'message' => "Please wait {$remaining} seconds before requesting another OTP.",
                        'retry_after' => $remaining,
                    ], 429);
                }
            }

            $otp = (string) random_int(100000, 999999);

            Otp::updateOrCreate(
                ['email' => $email],
                [
                    'otp' => $otp,
                    'expires_at' => now()->addMinutes(5),
                    'last_sent_at' => now(),
                ]
            );

            Mail::to($email)->send(new OtpMail($otp));

            return response()->json([
                'message' => 'OTP sent successfully',
                'retry_after' => 60,
            ]);
        });
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ]);

        $otpRecord = Otp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (! $otpRecord) {
            return response()->json([
                'message' => 'Invalid OTP',
            ], 422);
        }

        if ($otpRecord->expires_at->isPast()) {
            $otpRecord->delete();

            return response()->json([
                'message' => 'OTP has expired',
            ], 422);
        }

        $otpRecord->delete();

        return response()->json([
            'message' => 'Email verified successfully.',
        ], 200);
    }
}
