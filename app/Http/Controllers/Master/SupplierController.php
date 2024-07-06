<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\Supplier;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $supplier = Supplier::where('status', '<=' , 1)
        ->orderBy('id', 'asc')
        ->get();        
        return Inertia::render('Master/Supplier', ['supplier' => $supplier]);
    }

    public function show($id)
    {
        $supplier = Supplier::where('status', '<=' , 1)
        ->find($id);

        return Inertia::render('Master/Supplier');
    }

    public function store(Request $request)
    {
        try {
            // Check if a record with the same code already exists
            if (Supplier::where('code', $request->input('code'))->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Your logic to store the material data
            $validateData = $request->validate([
                'code'                      => 'required|string|max:255',
                'name'                      => 'required|string|max:255',
                'type'                      => 'required|string|max:255',
                'pic'                       => 'required|string|max:255',
                'address'                   => 'required|string|max:255',
                'phone'                     => 'required|string|max:255',
                'payment_due'               => 'required|integer',
                'status'                    => 'required|'
            ]);
            Supplier::create( $validateData );

            return Inertia::render('Master/Supplier');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $supplier = Supplier::where('status', '<=' , 1)
        ->find($id);
        $supplier->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/Supplier');
    }

    public function update(Request $request, $id)
    {
        try {
            // Check if a record with the same code already exists
            // if (Supplier::where('code', $request->input('code'))->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            // Your logic to store the material data
            $supplier = Supplier::where('status', '<=' , 1)
            ->find($id);

            $validateData = $request->validate([
                'code'                      => 'required|string|max:255',
                'name'                      => 'required|string|max:255',
                'type'                      => 'required|integer|max:11',
                'pic'                       => 'required|string|max:255',
                'address'                   => 'required|string|max:255',
                'phone'                     => 'required|string|max:255',
                'payment_due'               => 'required|integer',
                'status'                    => 'required'
            ]);

            $supplier->update( $validateData );

            return Inertia::render('Master/Supplier');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
