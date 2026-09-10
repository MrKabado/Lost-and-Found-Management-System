<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\FoundItemController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LostItemController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/items', [ItemController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/lost-items', [LostItemController::class, 'index']);
    Route::post('/lost-items', [LostItemController::class, 'store']);
    Route::get('/lost-items/{lostItem}', [LostItemController::class, 'show']);
    Route::match(['put', 'patch'], '/lost-items/{lostItem}', [LostItemController::class, 'update']);
    Route::delete('/lost-items/{lostItem}', [LostItemController::class, 'destroy']);

    Route::get('/found-items', [FoundItemController::class, 'index']);
    Route::post('/found-items', [FoundItemController::class, 'store']);
    Route::get('/found-items/{foundItem}', [FoundItemController::class, 'show']);
    Route::match(['put', 'patch'], '/found-items/{foundItem}', [FoundItemController::class, 'update']);
    Route::delete('/found-items/{foundItem}', [FoundItemController::class, 'destroy']);

    Route::get('/claims', [ClaimController::class, 'index']);
    Route::get('/claims/{claim}', [ClaimController::class, 'show']);
    Route::post('/found-items/{foundItem}/claims', [ClaimController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
        Route::get('/admin/lost-items', [LostItemController::class, 'adminIndex']);
        Route::delete('/admin/lost-items/{lostItem}', [LostItemController::class, 'adminDestroy']);
        Route::get('/admin/found-items', [FoundItemController::class, 'adminIndex']);
        Route::get('/admin/claims', [ClaimController::class, 'adminIndex']);
        Route::post('/admin/claims/{claim}/approve', [ClaimController::class, 'approve']);
        Route::post('/admin/claims/{claim}/reject', [ClaimController::class, 'reject']);
    });
});
