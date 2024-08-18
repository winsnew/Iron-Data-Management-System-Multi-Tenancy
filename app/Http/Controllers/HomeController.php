<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Tenants\User;
use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        
        return Inertia::render("Components/Homepage");
        
    }

    public function getUserData()
    {
        $user = Auth::guard('tenant')->user(); // Ambil data pengguna dari tenant
        $userName = $user ? $user->name : 'Guest'; // Sesuaikan dengan nama kolom

        return response()->json([
            'userName' => $userName,
        ]);
    }
}
