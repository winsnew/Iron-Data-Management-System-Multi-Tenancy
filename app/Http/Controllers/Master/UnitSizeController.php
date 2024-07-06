<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\UnitSize;
use Inertia\Inertia;

class UnitSizeController extends Controller
{
    public function index()
    {
        $unit = UnitSize::where('status', '<=' , 1)
        ->orderBy('id', 'desc')
        ->get();
        return Inertia::render('Master/UnitSize', ['unit' => $unit]);
    }

    public function store(Request $request)
    {
         try {
            // Check if a record with the same code already exists
            if (UnitSize::where('unit', $request->input('unit'))->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Your logic to store the material data
            $validateData = $request->validate([
                'unit'          => 'required',
                'status'        => 'required'
            ]);
            UnitSize::create($validateData);

            return Inertia::render('Master/UnitSize');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $unit = UnitSize::where('status', '<=' , 1)
        ->find($id);
        $unit->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/UnitSize');
    }

    public function update(Request $request, $id)
    {
         try {
            // Check if a record with the same code already exists
            // if (UnitSize::where('unit', $request->input('unit'))->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            // Your logic to store the material data
            $unit = UnitSize::where('status', '<=' , 1)
            ->find($id);

            $validateData = $request->validate([
                'unit'              => 'required',
                'status'            => 'required'
            ]);

            $unit->update( $validateData );

            return Inertia::render('Master/UnitSize');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
