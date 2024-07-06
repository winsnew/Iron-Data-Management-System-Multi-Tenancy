<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;

//Tenant Controllers
use App\Http\Controllers\ManageTenant\{
    AdminTenantController,
};

// Master Controllers
use App\Http\Controllers\Master\{
    MaterialController,
    RawProductController,
    GoodsProductController,
    SupplierController,
    CustomerController,
    WarehouseController,
    DashboardController,
    UnitSizeController,
};

// Production Controllers
use App\Http\Controllers\Production\{
    InputController,
    InputDetailController,
    ProductionController,
    ResultController,
    ResultDetailController
};

// Purchase Controllers
use App\Http\Controllers\Purchase\{
    OrderController,
    OrderDetailRawController,
    ReceiveOrderController,
    ReceiveOrderDetailController,
    ReturnOrderController,
    ReturnOrderDetailController,
    ReturnOrderGoodsController,
    BuyController,
    BuyDetailController,
};

//Stock Controller
use App\Http\Controllers\Stock\{
    RawProductStockController,
    RawprodcutStockDetailController,
    GoodsProductStockController,
    GoodsProductStockDetailController,
    OpnameController,
    OpnameGoodsProductController,
    OpnameRawProductController,
};

//Sales Controller
use App\Http\Controllers\Sales\{
    ProductSalesController,
    ProductSalesDetailController,
    ProductReturnController,
    ProductReturnDetailController
};

//Inertia
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

use App\Http\Middleware\HandleInertiaRequests;


Route::middleware([HandleInertiaRequests::class])->group(function () {
    Route::get('/rent', [AdminTenantController::class, 'index']);
    Route::get('/rent/login', [AdminTenantController::class, 'showLogin']);
    Route::post('/rent/login', [AdminTenantController::class, 'login']);

    
        Route::get('/dashboard', [AdminTenantController::class, 'tes']);
        Route::get('/dashboard/tenant', [AdminTenantController::class, 'tes2']);
});


//Auth


// // Route
// Route::middleware(['auth'])->group(function () {
// Route::get('/', [HomeController::class, 'index']);
// Route::get('/', [DashboardController::class, 'index']);
// // Data Master
// Route::resources([
//     'materials' => MaterialController::class,
//     'raw-product' => RawProductController::class,
//     'goods-product' => GoodsProductController::class,
//     'supplier' => SupplierController::class,
//     'customers' => CustomerController::class,
//     'warehouse' => WarehouseController::class,
//     'unit-size' => UnitSizeController::class,
// ]);
//     // Purchase
//     Route::resources([
//         'order' => OrderController::class,
//         'order-detail-raw' => OrderDetailRawController::class,
//         'receive-order' => ReceiveOrderController::class,
//         'receive-order-detail' => ReceiveOrderDetailController::class,
//         'return-order' => ReturnOrderController::class,
//         'return-order-detail' => ReturnOrderDetailController::class,
//         'return-order-goods' => ReturnOrderGoodsController::class,
//         'buy' => BuyController::class,
//         'buy-detail' => BuyDetailController::class
//     ]);

//     //Production
//     Route::resources([
//         'input' => InputController::class,
//         'inputdetail' => InputDetailController::class,
//         'result' => ResultController::class,
//         'resultdetail' => ResultDetailController::class
//     ]);

//     //Stock
//     Route::resources([
//         'rawproductstock' => RawProductStockController::class,
//         'rawproductstockdetail' => RawprodcutStockDetailController::class,
//         'goods-product-stock' => GoodsProductStockController::class,
//         'goods-product-detail-stock' => GoodsProductStockDetailController::class,
//         'opname' => OpnameController::class,
//         'opname-goods-product' => OpnameGoodsProductController::class,
//         'opname-raw-product' => OpnameRawProductController::class,

//     ]);

//     //Sales
//     Route::resources([
//         'product-sales' => ProductSalesController::class,
//         'product-sales-detail' => ProductSalesDetailController::class,
//         'product-return' => ProductReturnController::class,
//         'product-return-detail' => ProductReturnDetailController::class
//     ]);

//     //Order Raw
//     Route::get('/edit-order-raw/{id}', [OrderDetailRawController::class, 'editId']);
//     Route::post('/add-order-raw', [OrderController::class, 'addOrderRaw']);
//     Route::put('/update-order-raw/{id}', [OrderController::class, 'updateThisOrderRaw']);
//     Route::put('/posting-order-raw/{id}', [OrderController::class, 'posting']);
//     Route::get('/generalorder', [OrderDetailRawController::class, 'GeneralOrder']);

//     // Receive Order
//     Route::get('/edit-receive-order-raw/{id}', [ReceiveOrderDetailController::class, 'editId']);
//     Route::put('/posting-receive-order/{id}', [ReceiveOrderController::class, 'posting']);

//     // Return Order
//     Route::get('/edit-return-order-raw/{id}', [ReturnOrderDetailController::class, 'editId']);
//     Route::post('/save-return-order-raw', [ReturnOrderController::class, 'store']);
//     Route::delete('/delete-return-order-detail-raw/{id}', [ReturnOrderDetailController::class, 'destroy']);
//     Route::delete('/delete-return-order-raw/{id}', [ReturnOrderController::class, 'destroy']);
//     Route::put('/update-return-order-detail-raw/{id}', [ReturnOrderDetailController::class, 'update']);
//     Route::put('/update-return-order-raw/{id}', [ReturnOrderController::class, 'update']);
//     Route::put('/posting-return-order/{id}', [ReturnOrderController::class, 'posting']);

//     //Buy
//     Route::get('/detail-buy/{id}', [BuyDetailController::class, 'showID']);

//     // Stock Raw Product
//     Route::get('/stock-raw-detail/{id}', [RawProductStockController::class, 'show']);

// });