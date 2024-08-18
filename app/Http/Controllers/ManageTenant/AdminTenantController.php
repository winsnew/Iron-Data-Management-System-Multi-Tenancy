<?php

namespace App\Http\Controllers\ManageTenant;

use Stancl\Tenancy\Contracts\Tenant as TenantContract;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Tenants\User;
use App\Models\UserCentral;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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

        $tenant = Tenant::create(['id' => $request->domain]);

        $tenant->domains()->create([
            'domain' => $request->domain . '.' . env('APP_CENTRAL_DOMAIN'),
        ]);

        $user = UserCentral::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'domain' => $request->domain,
            'tenant_id' => $request->domain
        ]);

        tenancy()->initialize($tenant);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
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

        DB::beginTransaction();

        try {

            $tenant = Tenant::findOrFail($id);

            if ($tenant->id !== $request->domain) {

                $newdomain = $request->domain;
                $tenant->domains()->update(
                    ['domain' => $newdomain]
                );


                UserCentral::where('domain', $id)->update(['domain' => $newdomain, 'tenant_id' => $id]);
            }

            $tenant->status = $request->status;
            $tenant->save();

            DB::commit();

            return response()->json([
                'message' => 'Tenant updated successfully!',
                'tenant' => $tenant,
            ], 200);
        } catch (\Exception $e) {
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
                // Find and delete the user if they exist
                $user = UserCentral::where('email', $email)->first();
                if ($user) {
                    $user->delete();
                }
            }
            $tenant->delete();

            DB::commit();
            return response()->json(['message' => 'Tenant deleted successfully!'], 200);
        } catch (\Exception $e) {

            DB::rollBack();
            Log::error("An error occurred while deleting tenant: " . $e->getMessage());
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
