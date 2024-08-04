<?php

use App\Http\Controllers\ManageTenant\AdminTenantController;
use App\Http\Controllers\ManageTenant\CentralController;
use App\Http\Controllers\ManageTenant\UserTenantController;
use App\Http\Middleware\CentralAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/login', [CentralController::class, 'login']);
Route::post('/logout', [CentralController::class, 'logout']);

Route::middleware(['auth.central', 'auth:sanctum'])->group(function () {
Route::apiResource(
    'tenants', AdminTenantController::class,
);
Route::apiResource(
    'tenantUsers', UserTenantController::class,
);
});
