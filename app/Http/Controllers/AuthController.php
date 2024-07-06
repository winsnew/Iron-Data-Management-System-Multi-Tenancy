<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (auth()->guard('tenant')->attempt($credentials)) {
            return redirect('/'); // Adjust the redirect path as needed
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    public function logout()
    {
        auth()->guard('tenant')->logout();
        return redirect('/login');
    }
}
