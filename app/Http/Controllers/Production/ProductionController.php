<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function index()
    {
        return Inertia::render("Production/Production");
    }
    public function show()
    {
        return Inertia::render("Production/ReceiveOrder");
    }
}
