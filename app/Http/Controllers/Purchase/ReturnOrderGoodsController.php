<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturnOrderGoodsController extends Controller
{
    public function index()
    {
        return Inertia::render('Purchase/ReturnOrder/ReturnOrderGoods');
    }
}