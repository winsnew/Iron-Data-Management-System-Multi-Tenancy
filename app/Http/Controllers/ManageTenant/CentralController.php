<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CentralController extends Controller
{
<<<<<<< HEAD
    public function loginAdmin(Request $request)
    {
        $credentials = $request->validate([
=======
    public function login (Request $request) 
    {
        $credential = $request->validate([
>>>>>>> e0d6f0e0fc13eb4b711ce13335c702cda739b408
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

<<<<<<< HEAD
        if (Auth::guard('central')->attempt($credentials)) {
            $token = Auth::guard('central')->user()->createToken('auth-token')->plainTextToken;
            return response()->json(['message' => 'Login successful'], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logoutAdmin(Request $request)
    {
        Auth::guard('central')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logout successful'], 200);
=======
        if (Auth::guard('central')->attempt($credential)) {
            
            return response()->json([
                'message' => 'Login successful',
                'user' => auth('central')->user(),
            ], 200);
        }
        
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }
    public function logout(Request $request)
    {
        Auth::guard('central')->logout();
        
        
        return response()->json([
            'message' => 'Logout successful'
        ], 200);
>>>>>>> e0d6f0e0fc13eb4b711ce13335c702cda739b408
    }
}
