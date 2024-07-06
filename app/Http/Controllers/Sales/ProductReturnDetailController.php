<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductReturnDetailController extends Controller
{
    public function index(){
        return inertia::render('Sales/ProductReturn/ProductReturnDetail');
    }
}
