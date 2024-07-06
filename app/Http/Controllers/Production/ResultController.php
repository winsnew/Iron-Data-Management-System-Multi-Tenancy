<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index()
    {
        // $input = input::all();
        return Inertia::render('Production/Result');
        // , ['input' => $input]
    }
}
