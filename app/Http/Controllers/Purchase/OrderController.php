<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Tenants\OrderRaw;
use App\Models\Tenants\RawProduct;
use App\Models\Tenants\OrderRawDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = DB::table('pc_order_raw')
            ->join('ms_supplier', 'pc_order_raw.supplier_id', '=', 'ms_supplier.id')
            ->select('pc_order_raw.*', 'ms_supplier.type')
            ->where('pc_order_raw.status', 0)
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Purchase/Order/Order', [
            'orders' => $orders,
            'successMessage' => session()->get('successMessage'),
        ]);
    }
    public function addOrderRaw(Request $request)
    {
        try {
        DB::beginTransaction();
            $po = 'PO-' . date('YmdHis');
            $formData = $request->input('formData');
 
            $validatedData = $request->validate([
                'supplier_id' => 'required',
                'weight_order_total' => 'required',
                'price_order_total' => 'required',
                'amount_order_total' => 'required',
                'note' => 'nullable',
            ]);

            $orderRaw = OrderRaw::create([
                'order_raw_no' => $po,
                'date' => now(),
                'supplier_id' => $request->input('supplier_id'),
                'weight_order_total' => $request->input('weight_order_total'),
                'price_order_total' => $request->input('price_order_total'),
                'amount_order_total' => $request->input('amount_order_total'),
                'note' => $request->input('note') ?? '-',
                'status' => 0,
            ]);

            $id = $orderRaw->id;
            $dataTemp = $request->input('dataTemp');

            if ($dataTemp) {
                /// Assuming $yourArray contains the above structure
                foreach ($dataTemp as $item) {
                    $rawProductId = $item['raw_product_id'];
                    $code = $item['code'];
                    $name = $item['material'];
                    $size = $item['size'];
                    $status = $item['status'];
                    $note = $item['note'];

                // Define validation rules
                $rules = [
                    'raw_product_id' => 'required|integer',
                    'code' => 'required|string',
                    'material' => 'required|string',
                    'size' => 'required|string',
                    'note' => 'nullable|string',
                ];

                // Validate the data
                $validator = Validator::make($item, $rules);

                // Check if validation fails
                if ($validator->fails()) {
                    // Validation failed, return response with errors
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                    // Now you can use these variables as needed
                    // For example, you can create an OrderRawDetail
                    $newData = new OrderRawDetail([
                        'pc_order_raw_id' => $id,
                        'raw_product_id' => $rawProductId,
                        'code' => $code,
                        'material' => $name, // Assuming 'name' is equivalent to 'material'
                        'size' => $size,
                        'status' => $status,
                        'note' => $note ?? '-',
                    ]);

                    // Save the new OrderRawDetail
                    $newData->save();
                }

            }
        DB::commit();
            session()->flash('successMessage', 'Item added successfully');
            return response()->json(['data' => 'success adding data'], 200);
        } catch (\Exception $e) {
        DB::rollBack();
            // Handle the exception
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Your logic to store the material data
            $orderId = OrderRaw::find($id);
            $orderId->update([
                'status' => 5,
            ]);

            // If everything is successful, return success response
            return response()->json(['message' => 'Item deleted successfully']);
        } catch (\Exception $e) {
            // If an exception occurs, return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateThisOrderRaw(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $order = OrderRaw::find($id);

            $formData = $request->input('formData');

            $validatedData = $request->validate([
                'supplier_id' => 'required',
                'weight_order_total' => 'required',
                'price_order_total' => 'required',
                'amount_order_total' => 'required',
                'note' => 'nullable|string',
            ]);

            $order->update([
                'supplier_id' => $request->input('supplier_id'),
                'weight_order_total' => $request->input('weight_order_total'),
                'price_order_total' => $request->input('price_order_total'),
                'amount_order_total' => $request->input('amount_order_total'),
                'note' => $request->input('note') ?? '-',
                'status' => 0,
            ]);

            $dataDatabase = $request->input('dataDatabase');

                if ($dataDatabase) {
                    foreach ($dataDatabase as $data) {
                        $rules = [
                            'raw_product_id' => 'required',
                            'code' => 'required',
                            'material' => 'required',
                            'size' => 'required',
                            'status' => 'required',
                            'note' => 'nullable',
                        ];

                        $validator = Validator::make($data, $rules);

                        // Check if validation fails
                        if ($validator->fails()) {
                            // Validation failed, return response with errors
                            return response()->json(['errors' => $validator->errors()], 400);
                        }

                        // Check if an item with the same ID exists
                        $existingItem = OrderRawDetail::where('pc_order_raw_id', $id)
                            ->where('raw_product_id', $data['raw_product_id'])
                            ->first();

                        if ($existingItem) {
                            // Item exists, update it
                            $existingItem->update([
                                'code' => $data['code'],
                                'material' => $data['material'],
                                'size' => $data['size'],
                                'status' => $data['status'],
                                'note' => $data['note'],
                            ]);
                        } else {
                            // Item does not exist, create it
                            OrderRawDetail::create([
                                'pc_order_raw_id' => $id,
                                'raw_product_id' => $data['raw_product_id'],
                                'code' => $data['code'],
                                'material' => $data['material'],
                                'size' => $data['size'],
                                'status' => $data['status'],
                                'note' => $data['note'],
                            ]);
                        }
                    }

                    // Delete items that are not present in the current $dataDatabase
                    OrderRawDetail::where('pc_order_raw_id', $id)
                        ->whereNotIn('raw_product_id', array_column($dataDatabase, 'raw_product_id'))
                        ->delete();
                }
            DB::commit();
            return response()->json(['data' => 'success adding data2'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }
    public function posting(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $order = OrderRaw::find($id);

            $formData = $request->input('formData');

            $validatedData = $request->validate([
                'supplier_id' => 'required',
                'weight_order_total' => 'required',
                'price_order_total' => 'required',
                'amount_order_total' => 'required',
                'note' => 'required|string',
            ]);

            $order->update([
                'supplier_id' => $request->input('supplier_id'),
                'weight_order_total' => $request->input('weight_order_total'),
                'price_order_total' => $request->input('price_order_total'),
                'amount_order_total' => $request->input('amount_order_total'),
                'note' => $request->input('note'),
                'status' => 1,
            ]);

            $dataDatabase = $request->input('dataDatabase');

                if ($dataDatabase) {
                    foreach ($dataDatabase as $data) {
                        $rules = [
                            'raw_product_id' => 'required',
                            'code' => 'required',
                            'material' => 'required',
                            'size' => 'required',
                            'status' => 'required',
                            'note' => 'nullable',
                        ];

                        $validator = Validator::make($data, $rules);

                        // Check if validation fails
                        if ($validator->fails()) {
                            // Validation failed, return response with errors
                            return response()->json(['errors' => $validator->errors()], 400);
                        }

                        // Check if an item with the same ID exists
                        $existingItem = OrderRawDetail::where('pc_order_raw_id', $id)
                            ->where('raw_product_id', $data['raw_product_id'])
                            ->first();

                        if ($existingItem) {
                            // Item exists, update it
                            $existingItem->update([
                                'code' => $data['code'],
                                'material' => $data['material'],
                                'size' => $data['size'],
                                'status' => $data['status'],
                                'note' => $data['note'],
                            ]);
                        } else {
                            // Item does not exist, create it
                            OrderRawDetail::create([
                                'pc_order_raw_id' => $id,
                                'raw_product_id' => $data['raw_product_id'],
                                'code' => $data['code'],
                                'material' => $data['material'],
                                'size' => $data['size'],
                                'status' => $data['status'],
                                'note' => $data['note'],
                            ]);
                        }
                    }

                    // Delete items that are not present in the current $dataDatabase
                    OrderRawDetail::where('pc_order_raw_id', $id)
                        ->whereNotIn('raw_product_id', array_column($dataDatabase, 'raw_product_id'))
                        ->delete();
                }
            DB::commit();
            return response()->json(['data' => 'success adding data2'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }
}