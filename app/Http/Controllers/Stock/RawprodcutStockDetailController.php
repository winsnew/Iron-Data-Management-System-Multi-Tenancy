<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use App\Models\StockRaw;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RawprodcutStockDetailController extends Controller
{
    public function index()
    {
        // $input = input::all();
        return Inertia::render('Stock/RawProduct/RawProductStockDetail');
        // , ['input' => $input]
    }
}