<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Tenants\ReturnRaw;
use App\Models\Tenants\ReturnRawDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReturnOrderController extends Controller
{

    /**
     * Retrieves the list of return orders from the database.
     *
     * @throws Some_Exception_Class description of exception
     * @return Some_Return_Value
     */
    public function index()
    {
        $returnorders = DB::table('pc_return_raw')
                            ->rightJoin('pc_return_raw_detail', 'pc_return_raw.id', '=', 'pc_return_raw_detail.pc_return_raw_id',)
                            ->join('ms_supplier', 'pc_return_raw_detail.supplier_id', '=', 'ms_supplier.id')
                            ->select('pc_return_raw.id', 'pc_return_raw.return_raw_no', 'pc_return_raw.date', 'pc_return_raw.note', 'pc_return_raw.status', 'ms_supplier.type')
                            ->selectRaw('
                                CASE
                                    WHEN pc_return_raw.status = 3 THEN "Return"
                                    WHEN pc_return_raw.status = 2 THEN "Status 2"
                                    WHEN pc_return_raw.status = 1 THEN "Status 1"
                                    WHEN pc_return_raw.status = 0 THEN "Draft"
                                    ELSE "unknown"
                                END AS status')
                            ->selectRaw('
                                CASE
                                    WHEN ms_supplier.type = 1 THEN "Raw Product"
                                    WHEN ms_supplier.type = 0 THEN "Goods Product"
                                    ELSE "Bukan tipeku"
                                END AS type')
                            ->where('pc_return_raw.status', 0)
                            ->where('ms_supplier.status', 0)
                            ->whereNull('pc_return_raw.deleted_at')
                            ->whereNull('ms_supplier.deleted_at')
                            ->orderByDesc('pc_return_raw.date')
                            ->groupBy('pc_return_raw.id', 'pc_return_raw.return_raw_no', 'pc_return_raw.date', 'pc_return_raw.note', 'pc_return_raw.status', 'ms_supplier.type')
                            ->get();

        // dd($returnorders);
        return Inertia::render('Purchase/ReturnOrder/ReturnOrder', [
            'returnorders' => $returnorders,
            'successMessage' => session()->get('successMessage'),
            'deleteMessage' => session()->get('deleteMessage'),
            'updateMessage' => session()->get('updateMessage'),
        ]);
    }


    /**
     * Stores the data from the request into the database.
     *
     * @param Request $request The request object containing the data to be stored.
     * @throws \Exception If an error occurs while storing the data.
     * @return \Illuminate\Http\JsonResponse The response indicating the success or failure of the operation.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $rt = 'RO' . '-' . date('YmdHis');

            $returnOrder = ReturnRaw::create([
                'return_raw_no' => $rt,
                'date' => now(),
                'note' => $request->input('note') ?? '-',
                'status' => 0
            ]);

            $id = $returnOrder->id;
            $dataTemp = $request->input('dataTemp');

            if ($dataTemp) {
                foreach ($dataTemp as $item) {
                    $ReceiveRawDetailId = $item['pc_recieve_raw_detail_id'];
                    $supplierId = $item['supplier_id'];
                    $reffRcv = $item['reff_rcv'];
                    $code = $item['code'];
                    $material = $item['material'];
                    $size = $item['size'];
                    $weight = $item['weight'];
                    $price = $item['price'];
                    $qtyReturn = $item['qty_rtn'];

                    // Define validation rules
                    $rules = [
                        'pc_recieve_raw_detail_id' => 'required|integer',
                        'supplier_id' => 'required|integer',
                        'reff_rcv' => 'required',
                        'code' => 'required',
                        'material' => 'required',
                        'size' => 'required',
                        'weight' => 'required',
                        'price' => 'required',
                        'qty_rtn' => 'required',
                    ];

                    // Validate the data
                    $validator = Validator::make($item, $rules);

                    // Check if validation fails
                    if ($validator->fails()) {
                        DB::rollBack();
                        return response()->json(['error' => $validator->errors()], 400);
                    }

                    $newData = new ReturnRawDetail([
                        'pc_return_raw_id' => $id,
                        'pc_recieve_raw_detail_id' => $ReceiveRawDetailId,
                        'supplier_id' => $supplierId,
                        'reff_rcv' => $reffRcv,
                        'code' => $code,
                        'material' => $material,
                        'size' => $size,
                        'weight' => $weight,
                        'price' => $price,
                        'qty_rtn' => $qtyReturn,
                    ]);

                    $newData->save();

                }
            }
            DB::commit();
            session()->flash('successMessage', 'Item added successfully');
            return response()->json(['data' => 'success adding data'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    /**
     * Destroys a record by its ID.
     *
     * @param int $id The ID of the record to be destroyed.
     * @throws \Exception If an error occurs while deleting the record.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the result of the operation.
     */
    public function destroy($id)
    {
        try {
            $data = ReturnRaw::find($id);
            $data->update([
                'status' => 5
            ]);
            // $dataDetail = ReturnRawDetail::Where('pc_return_raw_id', $id);
            // $dataDetail->delete();

            session()->flash('deleteMessage', 'Item deleted successfully');
            return response()->json(['data' => 'success deleting data'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $data = ReturnRaw::find($id);

            $newNote = $request->input('note');
            if ($data['note'] != $newNote) {
                $data->update([
                    'note' => $request->input('note'),
                    'date' => now()
                ]);
            }

            $dataDatabase = $request->input('dataDatabase');
            if ($dataDatabase) {
                foreach ($dataDatabase as $item) {
                    $Id = null;
                    // Check if the 'id' key is set before accessing it
                    if (isset($item['id'])) {
                        $Id = $item['id'];
                    }
                    $ReceiveRawDetailId = $item['pc_recieve_raw_detail_id'];
                    $supplierId = $item['supplier_id'];
                    $reffRcv = $item['reff_rcv'];
                    $code = $item['code'];
                    $material = $item['material'];
                    $size = $item['size'];
                    $weight = $item['weight'];
                    $price = $item['price'];
                    $qtyReturn = $item['qty_rtn'];
                    $status = $item['status'];

                    // Define validation rules
                    $rules = [
                        'pc_recieve_raw_detail_id' => 'required|integer',
                        'supplier_id' => 'required|integer',
                        'reff_rcv' => 'required',
                        'code' => 'required',
                        'material' => 'required',
                        'size' => 'required',
                        'weight' => 'required',
                        'price' => 'required',
                        'qty_rtn' => 'required',
                    ];

                    // Validate the data
                    $validator = Validator::make($item, $rules);

                    // Check if validation fails
                    if ($validator->fails()) {
                        DB::rollBack();
                        return response()->json(['error' => $validator->errors()], 400);
                    }



                    $dataDetail = ReturnRawDetail::where('pc_return_raw_id', $id)
                                                ->where('pc_recieve_raw_detail_id', $ReceiveRawDetailId)
                                                ->where('code', $code)
                                                ->withoutTrashed()
                                                ->first ();


                        // hanya akan aktif apabila nilai reff_rcv dan nilai code tidak sama
                    if ($dataDetail === null && $status === 'created') {
                        $newData = new ReturnRawDetail([
                            'pc_return_raw_id' => $id,
                            'pc_recieve_raw_detail_id' => $ReceiveRawDetailId,
                            'supplier_id' => $supplierId,
                            'reff_rcv' => $reffRcv,
                            'code' => $code,
                            'material' => $material,
                            'size' => $size,
                            'weight' => $weight,
                            'price' => $price,
                            'qty_rtn' => $qtyReturn,
                        ]);
                        $newData->save();
                    } else {
                        if ($Id) {
                            if ($status === 'deleted') {
                                $dataDetail->delete();
                            } elseif($dataDetail !== null && $dataDetail['qty_rtn'] !== $qtyReturn && $status === 'modified') {
                                $dataDetail->update([
                                    'qty_rtn' => $qtyReturn,
                                ]);
                            }
                        }
                    }
                }
            }


            DB::commit();
            session()->flash('updateMessage', 'Item updated successfully');
            return response()->json(['data' => 'success updating data'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
       }
    }

    public function posting(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $data = ReturnRaw::find($id);

            $newNote = $request->input('dataDatabase');
            if ($data['note'] != $newNote) {
                $data->update([
                    'note' => $request->input('note'),
                    'date' => now(),
                    'status' => 1
                ]);
            }

            $dataDatabase = $request->input('dataDatabase');
            if ($dataDatabase) {
                foreach ($dataDatabase as $item) {
                    $Id = null;
                    // Check if the 'id' key is set before accessing it
                    if (isset($item['id'])) {
                        $Id = $item['id'];
                    }
                    $ReceiveRawDetailId = $item['pc_recieve_raw_detail_id'];
                    $supplierId = $item['supplier_id'];
                    $reffRcv = $item['reff_rcv'];
                    $code = $item['code'];
                    $material = $item['material'];
                    $size = $item['size'];
                    $weight = $item['weight'];
                    $price = $item['price'];
                    $qtyReturn = $item['qty_rtn'];
                    $status = $item['status'];

                    // Define validation rules
                    $rules = [
                        'pc_recieve_raw_detail_id' => 'required|integer',
                        'supplier_id' => 'required|integer',
                        'reff_rcv' => 'required',
                        'code' => 'required',
                        'material' => 'required',
                        'size' => 'required',
                        'weight' => 'required',
                        'price' => 'required',
                        'qty_rtn' => 'required',
                    ];

                    // Validate the data
                    $validator = Validator::make($item, $rules);

                    // Check if validation fails
                    if ($validator->fails()) {
                        DB::rollBack();
                        return response()->json(['error' => $validator->errors()], 400);
                    }



                    $dataDetail = ReturnRawDetail::where('pc_return_raw_id', $id)
                                                ->where('pc_recieve_raw_detail_id', $ReceiveRawDetailId)
                                                ->where('code', $code)
                                                ->withoutTrashed()
                                                ->first ();


                        // hanya akan aktif apabila nilai reff_rcv dan nilai code tidak sama
                    if ($dataDetail === null && $status === 'created') {
                        $newData = new ReturnRawDetail([
                            'pc_return_raw_id' => $id,
                            'pc_recieve_raw_detail_id' => $ReceiveRawDetailId,
                            'supplier_id' => $supplierId,
                            'reff_rcv' => $reffRcv,
                            'code' => $code,
                            'material' => $material,
                            'size' => $size,
                            'weight' => $weight,
                            'price' => $price,
                            'qty_rtn' => $qtyReturn,
                        ]);
                        $newData->save();
                    } else {
                        if ($Id) {
                            if ($status === 'deleted') {
                                $dataDetail->delete();
                            } elseif($dataDetail !== null && $dataDetail['qty_rtn'] !== $qtyReturn && $status === 'modified') {
                                $dataDetail->update([
                                    'qty_rtn' => $qtyReturn,
                                ]);
                            }
                        }
                    }
                }
            }


            DB::commit();
            session()->flash('updateMessage', 'Item updated successfully');
            return response()->json(['data' => 'success updating data'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
       }
    }
}