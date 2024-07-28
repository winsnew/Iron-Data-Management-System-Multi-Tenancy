<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::with('domains')->get();
        $tenants = $tenants->map(function ($tenant) {
            return [
                'id' => $tenant->id,
                'name' => $tenant->data['name'] ?? '',
                'email' => $tenant->data['email'] ?? '',
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

        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'domain' => $request->domain,
        ]);


        $tenant = Tenant::create(['id' => $request->domain]);


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
            'domain' => 'required|string|max:255|unique:tenants,id,' . $id,
            'status' => 'required|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        try {
            // Find the tenant by ID
            $tenant = Tenant::findOrFail($id);
    
            // Find the associated user by the tenant's current domain
            $user = User::where('domain', $tenant->id)->firstOrFail();
    
            // Update the tenant domain if it has changed
            if ($tenant->id !== $request->domain) {
                // Update user domain
                $user->domain = $request->domain;
                $user->save();
    
                // Update tenant id
                $tenant->id = $request->domain;
    
                $tenant->domains()->updateOrCreate(
                    ['tenant_id' => $tenant->id],
                    ['domain' => $request->domain . '.' . env('APP_CENTRAL_DOMAIN')]
                );
            }
    
            // Update tenant status
            $tenant->status = $request->status;
            $tenant->save();
    
            // Commit the transaction
            DB::commit();
    
            return response()->json([
                'message' => 'Tenant updated successfully!',
                'tenant' => $tenant,
            ], 200);
    
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $tenant = Tenant::find($id);

            if (!$tenant) {
                DB::rollBack();
                return response()->json(['error' => 'Tenant not found'], 404);
            }

            $email = $tenant->data['email'] ?? null;
            if ($email) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->delete();
                }
            }
            $databaseName = $tenant->database()->getName();

            if (DB::select("SHOW DATABASES LIKE '{$databaseName}'")) {
                try {
                    DB::statement("DROP DATABASE IF EXISTS `{$databaseName}`");
                } catch (\Exception $e) {
                    DB::rollBack();
                    return response()->json(['error' => "Error dropping database '{$databaseName}': " . $e->getMessage()], 500);
                }
            }

            $tenant->delete();

            DB::commit();
            return response()->json(['message' => 'Tenant deleted successfully!'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
