<?php

namespace App\Http\Controllers\Purchase;

use App\Models\Tenants\RecieveRaw;
use Illuminate\Http\Request;
use App\Models\Tenants\RecieveRawDetail;
use App\Models\Tenants\Warehouse;
use App\Models\Tenants\OrderRaw;
use App\Models\Tenants\Supplier;
use App\Http\Controllers\Controller;
use App\Models\Tenants\Material;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReceiveOrderDetailController extends Controller
{
    public function index()
    {
        $data = OrderRaw::with('order')
                ->where('status', 0)
                ->orderBy('date', 'DESC')
                ->get();
        $receiveorderdetails = RecieveRawDetail::all();
        $warehouses = Warehouse::where('status', 0)->get();

        return Inertia::render('Purchase/ReceiveOrder/ReceiveOrderDetails', [
            'receiveorderdetails' => $receiveorderdetails,
            'warehouses' => $warehouses,
            'data' => $data,
        ]);
    }

    public function editId(Request $request, $id)
    {
        $receiveOrder_id = RecieveRaw::find($id);

        $data = OrderRaw::with('order')
                ->where('status', 0)
                ->get();

        $receiveorderdetails = DB::table('pc_recieve_raw_detail')
                                ->where('pc_recieve_raw_detail.pc_recieve_raw_id', '=', $id)
                                ->where('deleted_at', null)
                                ->get();

        $warehouses = Warehouse::where('status', 0)->get();

        return Inertia::render('Purchase/ReceiveOrder/ReceiveOrderDetails', [
            'receiveorderdetails' => $receiveorderdetails,
            'warehouses' => $warehouses,
            'data' => $data,
            'receiveId' => $receiveOrder_id,
        ]);
    }
    public function destroy($id)
    {
        try {
        $reciveId = RecieveRawDetail::find($id)->delete();
            return response()->json(['message' => 'Item deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting item', 'message' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $itemId) 
    {
        // Validate the request data
        $validatedData = $request->validate([
            'otherInputMaterial' => 'nullable',
            'otherInputSize' => 'required',
            'otherInputId' => 'required',
            'otherInputIdCode' => 'required',
            'reffPo' => 'required',
            'weight' => 'required',
            'price' => 'required',
            'qtyRcv' => 'required',
            'deliveryCost' => 'nullable',
        ]);

        // Find the record by ID
        $item = RecieveRawDetail::find($itemId);

        // Update the record with the validated data
        if ($item) {
        $item->update([
            'pc_order_raw_detail_id' => $validatedData['otherInputId'],
            'reff_po' => $validatedData['reffPo'],
            'code' => $validatedData['otherInputIdCode'],
            'size' => $validatedData['otherInputSize'],
            'weight' => $validatedData['weight'],
            'price' => $validatedData['price'],
            'qty_rcv' => $validatedData['qtyRcv'],
            'material' => $validatedData['otherInputMaterial'],
            'delivery_cost' => '0',
        ]);
            // You can return a response if needed
            return response()->json(['message' => 'Record updated successfully'], 200);
        } else {
            // Handle the case where the record is not found
            return response()->json(['message' => 'Record not found'], 404);
        }
    }
}