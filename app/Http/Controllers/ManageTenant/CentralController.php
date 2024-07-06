<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CentralController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'domain' => 'required|string|max:255|unique:tenants,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'domain' => $request->domain,
        ]);

        // Create tenant
        $tenant = Tenant::create(['id' => $request->domain]);

        // Optionally, add domain to tenant if needed
        $tenant->domains()->create([
            'domain' => $request->$user->domain . '.' . env('APP_CENTRAL_DOMAIN'),
        ]);

        return response()->json([
            'message' => 'Tenant created successfully!',
            'tenant' => $tenant,
        ], 201);
    }
}
