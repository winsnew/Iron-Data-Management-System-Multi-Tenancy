<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultDetailController extends Controller
{
    public function index()
    {
        // $input = input::all();
        return Inertia::render('Production/ResultDetail');
        // , ['input' => $input]
    }
}
