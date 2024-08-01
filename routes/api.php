<?php

use App\Http\Controllers\ManageTenant\AdminTenantController;
use App\Http\Controllers\ManageTenant\CentralController;
<<<<<<< HEAD
use App\Http\Controllers\ManageTenant\UserController;
use App\Http\Controllers\Purchase\OrderDetailRawController;
=======
>>>>>>> e0d6f0e0fc13eb4b711ce13335c702cda739b408
use App\Models\Tenants\User;
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

<<<<<<< HEAD
Route::post('/login', [CentralController::class, 'loginAdmin']);
Route::post('/central/logout', [CentralController::class, 'logoutAdmin']);

Route::middleware(['auth:central'])->group(function() {
    Route::apiResource(
        'tenants', AdminTenantController::class,
    );
});
=======
// Route::middleware('web')->group(function () {
Route::apiResource(
    'tenants', AdminTenantController::class,
);
// });
>>>>>>> e0d6f0e0fc13eb4b711ce13335c702cda739b408
