<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use App\Models\Tenants\Warehouse;
use Inertia\Inertia;

class GoodsProductStockController extends Controller
{

    public function index()
    {
        $warehouses = Warehouse::where('status', 0)->get();

        return Inertia::render('Stock/GoodsProduct/GoodsProduct', [
            'warehouses' => $warehouses
        ]);
    }

}