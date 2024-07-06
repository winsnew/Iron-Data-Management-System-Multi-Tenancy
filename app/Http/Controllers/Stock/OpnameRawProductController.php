<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OpnameRawProductController extends Controller
{
    public function index(){
        return inertia::render('Stock/Opname/RawProduct');
    }
}
