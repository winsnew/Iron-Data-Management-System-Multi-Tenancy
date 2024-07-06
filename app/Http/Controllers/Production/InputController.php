<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;    
use Inertia\Inertia;

class InputController extends Controller
{
    public function index()
    {
        // $input = input::all();
        return Inertia::render('Production/Input');
        // , ['input' => $input]
    }
}
