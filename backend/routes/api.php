<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\OperatorController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\StatsController;
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
        Route::get('/admin/stats', [StatsController::class, 'index']);

        Route::get('/admin/products', [ProductController::class, 'index']);
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::match(['post', 'patch'], '/admin/products/{product}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);

        Route::post('/admin/categories', [CategoryController::class, 'store']);

        Route::get('/admin/projects', [ProjectController::class, 'index']);
        Route::get('/admin/quotes', [ProjectController::class, 'quotes']);
        Route::post('/admin/projects', [ProjectController::class, 'store']);
        Route::get('/admin/projects/{project}/traces', [ProjectController::class, 'traces']);
        Route::get('/admin/projects/{project}/messages', [ProjectController::class, 'messages']);
        Route::post('/admin/projects/{project}/messages', [ProjectController::class, 'storeMessage']);
        Route::patch('/admin/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/admin/projects/{project}', [ProjectController::class, 'destroy']);

        Route::get('/admin/operators', [OperatorController::class, 'index']);
        Route::post('/admin/operators', [OperatorController::class, 'store']);
        Route::patch('/admin/operators/{operator}', [OperatorController::class, 'update']);
        Route::delete('/admin/operators/{operator}', [OperatorController::class, 'destroy']);

        Route::get('/admin/missions', [MissionController::class, 'index']);
        Route::post('/admin/missions', [MissionController::class, 'store']);
        Route::patch('/admin/missions/{mission}', [MissionController::class, 'update']);
        Route::delete('/admin/missions/{mission}', [MissionController::class, 'destroy']);
    });

    Route::middleware('role:operator')->group(function () {
        Route::get('/operator/me', [OperatorController::class, 'me']);
        Route::patch('/operator/duty', [OperatorController::class, 'updateDuty']);
        Route::get('/operator/missions', [MissionController::class, 'index']);
        Route::patch('/operator/missions/{mission}', [MissionController::class, 'update']);
    });

    Route::middleware('role:client')->group(function () {
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{project}', [ProjectController::class, 'show']);
        Route::get('/projects/{project}/messages', [ProjectController::class, 'messages']);
        Route::post('/projects/{project}/messages', [ProjectController::class, 'storeMessage']);
    });

});
