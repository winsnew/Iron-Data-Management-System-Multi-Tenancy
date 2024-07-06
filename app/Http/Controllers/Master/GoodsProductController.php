<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\GoodsProduct;
use App\Models\Tenants\Material;
use App\Models\Tenants\UnitSize;
use Inertia\Inertia;

class GoodsProductController extends Controller
{
    public function index()
    {
        $goodsproduct = GoodsProduct::where('status', '<=' , 1)
        ->orderBy('id', 'desc')
        ->get();
        $materials =  Material::where('status', 0)->get();
        $unit =  UnitSize::where('status', 0)->get();

        return Inertia::render('Master/GoodsProduct', [
            'goodsproduct' => $goodsproduct,
            'materials' => $materials,
            'unit' => $unit,
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Your logic to store the material data
            // Validate incoming request data
            $validatedData = $request->validate([
                'name' => 'required|string',
                'material_id' => 'required|integer|exists:ms_material,id',
                'quality' => 'required|string',
                'status' => 'required|integer|max:11',
                'size1' => 'required',
                'size2' => 'required',
                'size3' => 'required',
                'unit1' => 'required',
                'unit2' => 'required',
                'unit3' => 'required',
            ]);

            // Concatenate size components
            $size = $request->size1 . 'x' . $request->size2 . 'x' . $request->size3;
            // Create a formatted size string
            $validatedData['size'] = $request->size1 . 'x' . $request->unit1 . 'x' . $request->size2 . 'x' . $request->unit2 . 'x' . $request->size3 . 'x' . $request->unit3;

            // Find the corresponding material based on material_id
            $material = Material::find($validatedData['material_id']);

            // Generate a code based on various parameters
            $validatedData['code'] = $request->name . $material->code . $request->quality . $size;

            // Check if a record with the same code already exists
            if (GoodsProduct::where('code', $validatedData['code'])->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Create the goods product
            GoodsProduct::create($validatedData);

            return Inertia::render('Master/GoodsProduct');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $goodsproduct = GoodsProduct::where('status', '<=' , 1)
        ->find($id);
        $goodsproduct->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/GoodsProduct');
    }

    public function update(Request $request, $id)
    {
        try {
            // Your logic to store the material data
            // Find the goods product by ID
            $goodsProduct = GoodsProduct::where('status', '<=' , 1)
            ->find($id);

            // Validate incoming request data
            $validatedData = $request->validate([
                'name' => 'required|string',
                'material_id' => 'required|integer|exists:ms_material,id',
                'quality' => 'required|string',
                'status' => 'required|integer|max:11',
                'size1' => 'required',
                'size2' => 'required',
                'size3' => 'required',
                'unit1' => 'required',
                'unit2' => 'required',
                'unit3' => 'required',
            ]);

            // Concatenate size components
            $size = $request->size1 . 'x' . $request->size2 . 'x' . $request->size3;
            // Create a formatted size string
            $validatedData['size'] = $request->size1 . 'x' . $request->unit1 . 'x' . $request->size2 . 'x' . $request->unit2 . 'x' . $request->size3 . 'x' . $request->unit3;

            // Find the corresponding material based on material_id
            $material = Material::find($validatedData['material_id']);

            // Generate a code based on various parameters
            $validatedData['code'] = $request->name . $material->code . $request->quality . $size;

            // Check if a record with the same code already exists
            // if (GoodsProduct::where('code', $validatedData['code'])->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            // Update the goods product
            $goodsProduct->update($validatedData);

            return Inertia::render('Master/GoodsProduct');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}