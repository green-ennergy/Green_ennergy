<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public catalog
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    // Available to all authenticated users
    Route::get('/me', [AuthController::class, 'me']);

    // Administrator only
    Route::middleware('role:administrator')->group(function () {
        Route::get('/admin/clients', [UserController::class, 'getClients']);

        Route::get('/admin/products', [ProductController::class, 'index']);
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::match(['post', 'patch'], '/admin/products/{product}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);

        Route::post('/admin/categories', [CategoryController::class, 'store']);
    });

    // Operator only
    Route::middleware('role:operator')->group(function () {
        // other operator routes
    });

    // Client only
    Route::middleware('role:client')->group(function () {
        // client routes
    });

});
