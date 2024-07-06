<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductSalesController extends Controller
{
    public function index()
    {
        return Inertia::render('Sales/ProductSales/ProductSales');
    }
}