<?php

use Illuminate\Support\Facades\Route;

Route::match(['get', 'head'], '/', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'Green Energy API',
        'version' => '1.0.0'
    ]);
});

Route::match(['get', 'head'], '/index.php', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'Green Energy API',
        'version' => '1.0.0'
    ]);
});

Route::get('/test', function () {
    return 'BACKEND TEST 123';
});
