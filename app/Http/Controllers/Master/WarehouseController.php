<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\Warehouse;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouse = Warehouse::where('status', '<=' , 1)
        ->orderBy('id', 'desc')
        ->get();
        return Inertia::render('Master/Warehouse', ['warehouse' => $warehouse]);
    }

    public function show($id)
    {
        $warehouse = Warehouse::where('status', '<=' , 1)
        ->find($id);
        return Inertia::render('Master/Warehouse');
    }

    public function store(Request $request)
    {
        try {
            // Check if a record with the same code already exists
            if (Warehouse::where('code', $request->input('code'))->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Your logic to store the material data
            $validateData = $request->validate([
                'code'                      => 'required|string|max:40',
                'name'                      => 'required|string|max:40',
                'address'                   => 'required|string|max:40',
                'pic'                       => 'required|string|max:40',
                'desc'                      => 'required|string|max:40',
                'status'                    => 'required'  
            ]);


            Warehouse::create(  $validateData );
            return Inertia::render('Master/Warehouse');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::where('status', '<=' , 1)
        ->find($id);
        $warehouse->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/Warehouse');
    }

    public function update(Request $request, $id)
    {
        try {
            // Check if a record with the same code already exists
            // if (Warehouse::where('code', $request->input('code'))->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            // Your logic to store the material data
            $warehouse = Warehouse::where('status', '<=' , 1)
            ->find($id);
            
            $validateData = $request->validate([
                'code'                      => 'required|string|max:255',
                'name'                      => 'required|string|max:255',
                'address'                   => 'required|string|max:255',
                'pic'                       => 'required|string|max:255',
                'desc'                      => 'required|string|max:255',
                'status'                    => 'required'  
            ]);

            $warehouse->update( $validateData );

            return Inertia::render('Master/Warehouse');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
