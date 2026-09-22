<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FoundItemController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemStatusController;
use App\Http\Controllers\LostItemController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationRequestController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/register/send-otp', [AuthController::class, 'sendRegisterOtp'])->middleware('throttle:5,1');
Route::post('/forgot-password/send-otp', [AuthController::class, 'sendForgotPasswordOtp'])->middleware('throttle:5,1');
Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword']);
Route::post('verify-otp', [AuthController::class, 'verifyOtp']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/items', [ItemController::class, 'index']);
Route::get('/courses', [CourseController::class, 'index']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile', [StudentProfileController::class, 'show']);
    Route::post('/profile', [StudentProfileController::class, 'store']);
    Route::match(['put', 'patch'], '/profile', [StudentProfileController::class, 'update']);
    Route::get('/verification-requests', [VerificationRequestController::class, 'index']);
    Route::post('/verification-requests', [VerificationRequestController::class, 'store']);

    Route::get('/lost-items', [LostItemController::class, 'index']);
    Route::post('/lost-items', [LostItemController::class, 'store'])->middleware('verified');
    Route::get('/lost-items/{lostItem}', [LostItemController::class, 'show']);
    Route::match(['put', 'patch'], '/lost-items/{lostItem}', [LostItemController::class, 'update']);
    Route::delete('/lost-items/{lostItem}', [LostItemController::class, 'destroy']);

    Route::get('/found-items', [FoundItemController::class, 'index']);
    Route::post('/found-items', [FoundItemController::class, 'store'])->middleware('verified');
    Route::get('/found-items/{foundItem}', [FoundItemController::class, 'show']);
    Route::match(['put', 'patch'], '/found-items/{foundItem}', [FoundItemController::class, 'update']);
    Route::delete('/found-items/{foundItem}', [FoundItemController::class, 'destroy']);

    Route::get('/claims', [ClaimController::class, 'index']);
    Route::get('/claims/{claim}', [ClaimController::class, 'show']);
    Route::post('/found-items/{foundItem}/claims', [ClaimController::class, 'store'])->middleware('verified');

    Route::middleware('admin')->group(function (): void {
        Route::get('/admin/dashboard/statistics', [DashboardController::class, 'statistics']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
        Route::get('/admin/lost-items', [LostItemController::class, 'adminIndex']);
        Route::delete('/admin/lost-items/{lostItem}', [LostItemController::class, 'adminDestroy']);
        Route::patch('/admin/lost-items/{lostItem}/status', [ItemStatusController::class, 'updateLost']);
        Route::get('/admin/found-items', [FoundItemController::class, 'adminIndex']);
        Route::delete('/admin/found-items/{foundItem}', [FoundItemController::class, 'adminDestroy']);
        Route::patch('/admin/found-items/{foundItem}/status', [ItemStatusController::class, 'updateFound']);
        Route::get('/admin/claims', [ClaimController::class, 'adminIndex']);
        Route::get('/admin/claims/{claim}', [ClaimController::class, 'adminShow']);
        Route::post('/admin/claims/{claim}/approve', [ClaimController::class, 'approve']);
        Route::post('/admin/claims/{claim}/reject', [ClaimController::class, 'reject']);
        Route::get('/admin/users', [UserController::class, 'adminIndex']);
        Route::get('/admin/verification-requests', [VerificationRequestController::class, 'adminIndex']);
        Route::get('/admin/verification-requests/{verificationRequest}', [VerificationRequestController::class, 'adminShow']);
        Route::post('/admin/verification-requests/{verificationRequest}/approve', [VerificationRequestController::class, 'approve']);
        Route::post('/admin/verification-requests/{verificationRequest}/reject', [VerificationRequestController::class, 'reject']);
    });
});
