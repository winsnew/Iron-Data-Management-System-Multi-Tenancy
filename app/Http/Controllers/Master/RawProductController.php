<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Tenants\RawProduct;
use App\Models\Tenants\UnitSize;
use App\Models\Tenants\Material;

class RawProductController extends Controller
{
    public function index()
    {
            // Optimize the query to fetch only necessary columns
            $rawProducts = RawProduct::where('status', '<=' , 1)
                ->with('material')
                ->orderBy('id', 'desc')
                ->get();
            $materials =  Material::where('status', 0)->get();
            $unit =  UnitSize::where('status', 0)->get();


            // return response()->json($rawProducts);
            return Inertia::render('Master/RawProduct', [
                'rawProducts' => $rawProducts,
                'materials' => $materials,
                'unit' => $unit,
            ]);
    }

    public function getMaterialCodeByName($name)
    {
        try {
            $materialCode = Material::getMaterialCodeByName($name);

            if ($materialCode !== null) {
                return response()->json($materialCode);
            }

            return response()->json(['error' => 'Material not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching material code by name: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(Request $request)
    {
         try {
            // Your logic to store the material data
            // Validate request data
            $validateData = $request->validate([
                'material_id' => 'required|exists:ms_material,id', // Make sure material_id exists in ms_material table
                'status' => 'required',
                'size1' => 'required',
                'size2' => 'required',
                'unit1' => 'required',
                'unit2' => 'required'
            ]);

            $validateData['size'] = $request->size1 . 'x' . $request->unit1 . 'x' . $request->size2 . 'x' . $request->unit2;
            $size = $request->size1 . 'x' . $request->size2;
            // Fetch the corresponding code from ms_material based on material_id
            $material = Material::where('status', 0)->find($validateData['material_id']);

            // Check if material exists
            if (!$material) {
                return response()->json([
                    'message' => 'Material not found',
                ], 404);
            }

            // Combine code from ms_material with size
            $validateData['code'] = $material->code . $size;

            // Check if a record with the same code already exists
            if (RawProduct::where('code', $validateData['code'])->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Store data in ms_raw_product table
            RawProduct::create($validateData);

            return Inertia::render('Master/RawProduct');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroy($id)
    {
        $rawproduct = RawProduct::where('status', '<=' , 1)
        ->find($id);

        $rawproduct->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/RawProduct');
    }

    public function update(Request $request, $id)
    {
        try {
            // Your logic to store the material data
            $rawproduct = RawProduct::where('status', '<=' , 1)
            ->find($id);

            if (!$rawproduct) {
                return response()->json([
                    'message' => 'id not found',
                ]);
            }

            $validateData = $request->validate([
                'material_id' => 'required|exists:ms_material,id', // Make sure material_id exists in ms_material table
                'status' => 'required',
                'size1' => 'required',
                'size2' => 'required',
                'unit1' => 'required',
                'unit2' => 'required'
            ]);

            $validateData['size'] = $request->size1 . 'x' . $request->unit1 . 'x' . $request->size2 . 'x' . $request->unit2;
            $size = $request->size1 . 'x' . $request->size2;
            // Fetch the corresponding code from ms_material based on material_id
            $material = Material::where('status', 0)->find($validateData['material_id']);

            // Check if material exists
            if (!$material) {
                return response()->json([
                    'message' => 'Material not found',
                ], 404);
            }

            // Combine code from ms_material with size
            $validateData['code'] = $material->code . $size;

            // Check if a record with the same code already exists
            // if (RawProduct::where('code', $validateData['code'])->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            $rawproduct->update($validateData);

            return Inertia::render('Master/RawProduct');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }
}