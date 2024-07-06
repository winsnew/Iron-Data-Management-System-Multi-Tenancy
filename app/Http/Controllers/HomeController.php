<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Menu;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render("Components/Homepage");
    }
}
