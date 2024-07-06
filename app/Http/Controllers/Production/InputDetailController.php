<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InputDetailController extends Controller
{
    public function index()
    {
        // $input = input::all();
        return Inertia::render('Production/InputDetail');
        // , ['input' => $input]
    }
}
