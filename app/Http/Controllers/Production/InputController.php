<?php

namespace App\Http\Controllers\Production;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\Input;
use Inertia\Inertia;

class InputController extends Controller
{
    public function index()
    {
        // Fetch inputs with status <= 1, ordered by ID descending
        $inputs = Input::where('status', '<=', 1)
            ->orderBy('id', 'desc')
            ->get();

        // Return the Inertia view with inputs data
        return Inertia::render('Production/Input', ['inputs' => $inputs]);
    }

    public function show($id)
    {
        // Fetch a specific input by ID with status <= 1
        $input = Input::where('status', '<=', 1)
            ->find($id);

        if (!$input) {
            return response()->json(['error' => 'Input not found'], 404);
        }

        // Return the Inertia view for editing
        return Inertia::render('Production/Input', ['inputs' => $input]);
    }

    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validateData = $request->validate([
                'production_no' => 'required|string|max:255|unique:inputs,production_no',
                'date' => 'required|date',
                'material_weight' => 'required|numeric',
                'material_qty' => 'required|integer',
                'status' => 'required|integer',
            ]);

            // Create a new input record
            Input::create($validateData);
            // return Inertia::render('Production/Input');
            // Return a success response
            return response()->json(['message' => 'Input added successfully'], 201);
        } catch (\Exception $e) {
            // Return error response on failure
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Fetch the input to update
            $input = Input::where('status', '<=', 1)
                ->find($id);

            if (!$input) {
                return response()->json(['error' => 'Input not found'], 404);
            }

            // Validate the request data
            $validateData = $request->validate([
                'production_no' => 'required|string|max:255|unique:inputs,production_no,' . $id,
                'date' => 'required|date',
                'material_weight' => 'required|numeric',
                'material_qty' => 'required|integer',
                'status' => 'required|integer',
            ]);

            // Update the input record
            $input->update($validateData);
            // return Inertia::render('Production/Input');
            // Return a success response
            return response()->json(['message' => 'Input updated successfully']);
        } catch (\Exception $e) {
            // Return error response on failure
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Fetch the input to delete
            $input = Input::where('status', '<=', 1)
                ->find($id);

            if (!$input) {
                return response()->json(['error' => 'Input not found'], 404);
            }

            // Soft delete by updating the status to 5
            $input->update(['status' => 5]);
            // return Inertia::render('Production/Input');
            // Return a success response
            return response()->json(['message' => 'Input deleted successfully']);
        } catch (\Exception $e) {
            // Return error response on failure
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
