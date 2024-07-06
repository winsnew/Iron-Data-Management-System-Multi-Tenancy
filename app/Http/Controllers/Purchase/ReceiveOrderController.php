<?php

namespace App\Http\Controllers\Purchase;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Tenants\RecieveRaw;
use App\Models\Tenants\RecieveRawDetail;
use App\Models\OrderRaw;
use App\Models\Warehouse;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReceiveOrderController extends Controller
{
    public function index()
    {
        $receiveorders = RecieveRaw::where('status', 0)
                            ->orderBy('id', 'DESC')
                            ->get();
        return Inertia::render('Purchase/ReceiveOrder/ReceiveOrder', [
            'receiveorders' => $receiveorders,
            'successMessage' => session()->get('successMessage'),
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $rc = 'RC-' . date('YmdHis');

            $validatedData = $request->validate([
                'warehouse_id' => 'required',
                'weight_recieve_total' => 'required|numeric',
                'amount_recieve_total' => 'required|numeric',
                'note' => 'nullable|string',
            ]);

            $orderRaw = RecieveRaw::create([
                'recieve_raw_no' => $rc,
                'werehouse_id' => $request->input('warehouse_id'),
                'weight_recieve_total' => $request->input('weight_recieve_total'),
                'amount_recieve_total' => $request->input('amount_recieve_total'),
                'note' => $request->input('note') ?? '-',
                'status' => '0',
            ]);

            $id = $orderRaw->id;

            $formData = $request->input('dataTemp');

            if ($formData) {
                foreach ($formData as $data) {

                    $rules = [
                        'otherInputId' => 'required',
                        'reffPo' => 'required',
                        'otherInputIdCode' => 'required',
                        'otherInputSize' => 'required',
                        'weight' => 'required',
                        'price' => 'required',
                        'qtyRcv' => 'required',
                        'otherInputMaterial' => 'required',
                    ];

                    $validator = Validator::make($data, $rules);

                    // Check if validation fails
                    if ($validator->fails()) {
                        // Validation failed, return response with errors
                        return response()->json(['errors' => $validator->errors()], 400);
                    }

                    // Assuming you have a model named RecieveRawDetail
                    $newData = new RecieveRawDetail([
                        'pc_recieve_raw_id' => $id,
                        'pc_order_raw_detail_id' => $data['otherInputId'],
                        'reff_po' => $data['reffPo'],
                        'code' => $data['otherInputIdCode'],
                        'size' => $data['otherInputSize'],
                        'weight' => $data['weight'],
                        'price' => $data['price'],
                        'qty_rcv' => $data['qtyRcv'],
                        'material' => $data['otherInputMaterial'],
                        'delivery_cost' => '0',
                        'status' => '0',
                    ]);

                    $newData->save();
                }
            }
            DB::commit();
            session()->flash('successMessage', 'Item added successfully');
            return response()->json(['data' => 'success adding data'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $reciveId = RecieveRaw::find($id);
            $rc = 'RC-' . date('YmdHis');

            $validatedData = $request->validate([
                'warehouse_id' => 'required',
                'weight_recieve_total' => 'required|numeric',
                'amount_recieve_total' => 'required|numeric',
                'note' => 'nullable|string',
            ]);

            $reciveId->update([
                'recieve_raw_no' => $rc,
                'werehouse_id' => $request->input('warehouse_id'),
                'weight_recieve_total' => $request->input('weight_recieve_total'),
                'amount_recieve_total' => $request->input('amount_recieve_total'),
                'note' => $request->input('note') ?? '-',
                'status' => '0',
            ]);

            $dataDatabase = $request->input('dataDatabase');

                if ($dataDatabase) {
                    foreach ($dataDatabase as $data) {
                        $rules = [
                            'pc_order_raw_detail_id' => 'required',
                            'reff_po' => 'required',
                            'code' => 'required',
                            'size' => 'required',
                            'weight' => 'required',
                            'price' => 'required',
                            'qty_rcv' => 'required',
                        ];

                        $validator = Validator::make($data, $rules);

                        // Check if validation fails
                        if ($validator->fails()) {
                            // Validation failed, return response with errors
                            return response()->json(['errors' => $validator->errors()], 400);
                        }

                        // Check if an item with the same ID exists
                        $existingItem = RecieveRawDetail::where('id', $data['id'])
                            // ->where('pc_recieve_raw_id', $id)
                            // ->where('pc_order_raw_detail_id', $data['pc_order_raw_detail_id'])
                            ->first();

                        if ($data['id'] == null) {
                            RecieveRawDetail::create([
                                'pc_recieve_raw_id' => $id,
                                'pc_order_raw_detail_id' => $data['pc_order_raw_detail_id'],
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                                'delivery_cost' => '0',
                                'status' => '0',
                            ]);
                        }

                        if ($existingItem) {
                            // Item exists, update it
                            $existingItem->update([
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                            ]);
                        } else {
                            // Item does not exist, create it
                            RecieveRawDetail::create([
                                'pc_recieve_raw_id' => $id,
                                'pc_order_raw_detail_id' => $data['pc_order_raw_detail_id'],
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                                'delivery_cost' => '0',
                                'status' => '0',
                            ]);
                        }
                    }

                    // Delete items that are not present in the current $dataDatabase
                    RecieveRawDetail::where('pc_recieve_raw_id', $id)
                        ->whereNotIn('pc_order_raw_detail_id', array_column($dataDatabase, 'pc_order_raw_detail_id'))
                        ->delete();
                }
            session()->flash('successMessage', 'Item added successfully');
            DB::commit();
            return response()->json(['data' => 'success adding data2'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $reciveId = RecieveRaw::find($id);
        $reciveId->update([
            'status' => 5,
        ]);

        return Inertia::render('Purchase/ReceiveOrder/ReceiveOrder');
    }
    public function posting(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $reciveId = RecieveRaw::find($id);
            $rc = 'RC-' . date('YmdHis');

            $validatedData = $request->validate([
                'warehouse_id' => 'required',
                'weight_recieve_total' => 'required|numeric',
                'amount_recieve_total' => 'required|numeric',
                'note' => 'nullable|string',
            ]);

            $reciveId->update([
                'recieve_raw_no' => $rc,
                'werehouse_id' => $request->input('warehouse_id'),
                'weight_recieve_total' => $request->input('weight_recieve_total'),
                'amount_recieve_total' => $request->input('amount_recieve_total'),
                'note' => $request->input('note') ?? '-',
                'status' => '1',
            ]);

            $dataDatabase = $request->input('dataDatabase');

                if ($dataDatabase) {
                    foreach ($dataDatabase as $data) {
                        $rules = [
                            'pc_order_raw_detail_id' => 'required',
                            'reff_po' => 'required',
                            'code' => 'required',
                            'size' => 'required',
                            'weight' => 'required',
                            'price' => 'required',
                            'qty_rcv' => 'required',
                        ];

                        $validator = Validator::make($data, $rules);

                        // Check if validation fails
                        if ($validator->fails()) {
                            // Validation failed, return response with errors
                            return response()->json(['errors' => $validator->errors()], 400);
                        }

                        // Check if an item with the same ID exists
                        $existingItem = RecieveRawDetail::where('id', $data['id'])
                            // ->where('pc_recieve_raw_id', $id)
                            // ->where('pc_order_raw_detail_id', $data['pc_order_raw_detail_id'])
                            ->first();

                        if ($data['id'] == null) {
                            RecieveRawDetail::create([
                                'pc_recieve_raw_id' => $id,
                                'pc_order_raw_detail_id' => $data['pc_order_raw_detail_id'],
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                                'delivery_cost' => '0',
                                'status' => '1',
                            ]);
                        }

                        if ($existingItem) {
                            // Item exists, update it
                            $existingItem->update([
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                                'status' => '1',
                            ]);
                        } else {
                            // Item does not exist, create it
                            RecieveRawDetail::create([
                                'pc_recieve_raw_id' => $id,
                                'pc_order_raw_detail_id' => $data['pc_order_raw_detail_id'],
                                'reff_po' => $data['reff_po'],
                                'code' => $data['code'],
                                'size' => $data['size'],
                                'weight' => $data['weight'],
                                'price' => $data['price'],
                                'qty_rcv' => $data['qty_rcv'],
                                'delivery_cost' => '0',
                                'status' => '1',
                            ]);
                        }
                    }

                    // Delete items that are not present in the current $dataDatabase
                    RecieveRawDetail::where('pc_recieve_raw_id', $id)
                        ->whereNotIn('pc_order_raw_detail_id', array_column($dataDatabase, 'pc_order_raw_detail_id'))
                        ->delete();
                }
            session()->flash('successMessage', 'Item added successfully');
            DB::commit();
            return response()->json(['data' => 'success adding data2'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['data' => $e->getMessage()], 500);
        }
    }
}
