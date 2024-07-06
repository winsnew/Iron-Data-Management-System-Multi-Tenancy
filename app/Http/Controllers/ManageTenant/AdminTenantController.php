<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTenantController extends Controller
{
    public function index() {
        $tenants = Tenant::with('domains')->get();
        $tenants = $tenants->map(function ($tenant) {
            return [
                'id' => $tenant->id,
                'name' => $tenant->data['name'] ?? '',  // Asumsi nama tenant ada di data field
                'email' => $tenant->data['email'] ?? '',  // Asumsi email tenant ada di data field
                'domain' => $tenant->domains->isNotEmpty() ? $tenant->domains->first()->domain : '',
                'database' => $tenant->database_name,
                'status' => $tenant->status,
                'created_at' => $tenant->created_at->format('Y-m-d'),
            ];
        });
        return response()->json($tenants);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string',
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
            'domain' => $request->domain . '.' . env('APP_CENTRAL_DOMAIN'),
        ]);

        return response()->json([
            'message' => 'Tenant created successfully!',
            'tenant' => $tenant,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'domain' => 'required|string|max:255|unique:tenants,id,' . $id,
            'status' => 'required|string|max:255',
        ]);
    
        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // Find the user by ID
        $user = User::findOrFail($id);
        // Find the tenant by user's domain
        $tenant = Tenant::findOrFail($user->domain);
    
        // Update the user data
        $user->name = $request->name;
        $user->email = $request->email;
        $user->domain = $request->domain; // Update domain in user as well
        $user->status = $request->status; // Add status field in the User model if not already present
        $user->save();
    
        // Update the tenant data if domain is changed
        if ($request->domain !== $user->domain) {
            $tenant->id = $request->domain;
            $tenant->save();
    
            // Optionally, update tenant domains if needed
            $tenant->domains()->updateOrCreate(
                ['tenant_id' => $tenant->id],
                ['domain' => $request->domain . '.' . env('APP_CENTRAL_DOMAIN')]
            );
        }
    
        // Update tenant status if it's a field in the Tenant model
        if ($tenant->status !== $request->status) {
            $tenant->status = $request->status;
            $tenant->save();
        }
    
        // Return a successful response
        return response()->json([
            'message' => 'Tenant updated successfully!',
            'tenant' => $tenant,
        ], 200);
    }

    public function destroy ($id)
    {
        $tenant = Tenant::findOrFail($id);

        $user = User::where('domain', $tenant->id->first());
        if($user) {
            $user->delete();
        }

        $tenant->delete();
        return response()->json([
            'message' => 'Tenant Succesfully Deleted'
        ], 200);
    }
}
