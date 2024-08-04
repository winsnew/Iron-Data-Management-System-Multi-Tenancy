<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\UserCentral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CentralController extends Controller
{
    public function login(Request $request)
    {
        $credential = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('central')->attempt($credential)) {
            $request->session()->regenerateToken();
            return response()->json([
                'message' => 'Login successful',
                'user' => Auth::guard('central')->user(),
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }


    public function logout(Request $request)
    {
        Auth::guard('central')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful'
        ], 200);
    }
}
