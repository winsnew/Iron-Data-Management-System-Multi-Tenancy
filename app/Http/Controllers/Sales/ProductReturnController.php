<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductReturnController extends Controller
{
    public function index(){
        return inertia::render('Sales/ProductReturn/ProductReturn');
    }
}
