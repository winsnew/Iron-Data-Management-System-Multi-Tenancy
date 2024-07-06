<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\Material;
use Inertia\Inertia;


class MaterialController extends Controller
{
    public function index()
    {
        $materials =  Material::where('status', '<=' , 1)
        ->orderBy('id', 'desc')
        ->get();
        return Inertia::render('Master/Material', ['materials' => $materials]);

    }

    public function store(Request $request)
    {
        try {
            // Check if a record with the same code already exists
            if (Material::where('code', $request->input('code'))->where('status', 0)->exists()) {
                // If it exists, return an error response
                return response()->json(['error' => 'Material with the given code already exists'], 422);
            }

            // Your logic to store the material data
            $data = $request->validate([
                'code' => 'required',
                'name' => 'required',
                'status' => 'required',
            ]);

            $material = Material::create($data);

            return Inertia::render('Master/Material');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function destroy($id)
    {
        $material = Material::where('status', '<=' , 1)
        ->find($id);
        $material->update([
            'status' => 5,
        ]);

        return Inertia::render('Master/Material');
    }

    public function update(Request $request, $id)
    {
        try {
            // Check if a record with the same code already exists
            // if (Material::where('code', $request->input('code'))->where('status', 0)->exists()) {
            //     // If it exists, return an error response
            //     return response()->json(['error' => 'Material with the given code already exists'], 422);
            // }

            // Your logic to store the material data
            $material = Material::where('status', '<=' , 1)
            ->find($id);

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:255',
                'status' => 'required|max:255',
            ]);

            $material->update($validatedData);

            return Inertia::render('Master/Material');

            // If everything is successful, return success response
            return response()->json(['message' => 'Item added successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $material = Material::where('status', '<=' , 1)
        ->find($id);
        return Inertia::render('Master/Material');
    }
}
