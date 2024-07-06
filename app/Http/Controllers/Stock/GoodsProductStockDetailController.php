<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class GoodsProductStockDetailController extends Controller
{
    public function index()
    {
        return Inertia::render('Stock/GoodsProduct/GoodsProductDetail');
    }
}