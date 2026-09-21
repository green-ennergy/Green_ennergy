<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OperatorController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\RfqController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ServiceRequestController;
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
Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/service-requests', [ServiceRequestController::class, 'index']);
    Route::post('/service-requests', [ServiceRequestController::class, 'store']);
    Route::patch('/service-requests/{serviceRequest}', [ServiceRequestController::class, 'update']);

    Route::middleware('role:administrator')->group(function () {
        Route::get('/admin/clients', [UserController::class, 'getClients']);
        Route::get('/admin/stats', [StatsController::class, 'index']);

        Route::get('/admin/products', [ProductController::class, 'index']);
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::match(['post', 'patch'], '/admin/products/{product}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);

        Route::post('/admin/categories', [CategoryController::class, 'store']);

        Route::get('/admin/services', [ServiceController::class, 'index']);
        Route::post('/admin/services', [ServiceController::class, 'store']);
        Route::patch('/admin/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/admin/services/{service}', [ServiceController::class, 'destroy']);
        Route::get('/admin/service-requests', [ServiceRequestController::class, 'index']);

        Route::get('/admin/projects', [ProjectController::class, 'index']);
        Route::get('/admin/quotes', [ProjectController::class, 'quotes']);
        Route::get('/admin/rfq', [RfqController::class, 'adminIndex']);
        Route::patch('/admin/rfq/{rfq}/status', [RfqController::class, 'adminUpdateStatus']);
        Route::post('/admin/rfq/{rfq}/quote', [RfqController::class, 'adminQuote']);
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
        Route::get('/operator/service-requests', [ServiceRequestController::class, 'index']);
    });

    Route::middleware('role:client')->group(function () {
        Route::get('/rfq', [RfqController::class, 'index']);
        Route::post('/rfq', [RfqController::class, 'store']);
        Route::patch('/rfq/{rfq}/status', [RfqController::class, 'updateStatus']);
        Route::post('/rfq/{rfq}/confirm', [RfqController::class, 'confirm']);

        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{project}', [ProjectController::class, 'show']);
        Route::get('/projects/{project}/messages', [ProjectController::class, 'messages']);
        Route::post('/projects/{project}/messages', [ProjectController::class, 'storeMessage']);
    });

});
