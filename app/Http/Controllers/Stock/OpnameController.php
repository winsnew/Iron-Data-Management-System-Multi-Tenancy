<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OpnameController extends Controller
{
    public function index()
    {
        return Inertia::render('Stock/Opname/Opname');
    }
}