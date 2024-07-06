<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Tenants\Material;
use App\Models\Tenants\OrderRaw;
use App\Models\Tenants\OrderRawDetail;
use App\Models\Tenants\RawProduct;
use App\Models\Tenants\RecieveRaw;
use App\Models\Tenants\RecieveRawDetail;
use App\Models\Tenants\ReturnRaw;
use App\Models\Tenants\ReturnRawDetail;
use App\Models\Tenants\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReturnOrderDetailController extends Controller
{
    public function index()
    {
        $data = RecieveRawDetail::orderByRaw('CASE WHEN updated_at IS NULL THEN 1 ELSE 0 END, updated_at DESC, created_at DESC')
                                ->withoutTrashed()
                                ->get();
        $returnorderdetails = ReturnRawDetail::orderByRaw('CASE WHEN updated_at IS NULL THEN 1 ELSE 0 END, updated_at DESC, created_at DESC')
                                            ->withoutTrashed()
                                            ->get();
        $receive = RecieveRaw::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $orderRaw = OrderRawDetail::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $order = OrderRaw::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $supplier = Supplier::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $material = Material::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $rawProduct = RawProduct::where('status', 0)
                            ->withoutTrashed()
                            ->get();
        $dataNew = DB::table('pc_recieve_raw_detail')
                        ->leftJoin('pc_recieve_raw', 'pc_recieve_raw_detail.pc_recieve_raw_id', '=', 'pc_recieve_raw.id')
                        ->join('pc_order_raw_detail', 'pc_recieve_raw_detail.pc_order_raw_detail_id', '=', 'pc_order_raw_detail.id')
                        ->join('pc_order_raw', 'pc_recieve_raw_detail.reff_po', '=', 'pc_order_raw.order_raw_no')
                        ->join('ms_supplier', 'pc_order_raw.supplier_id', '=', 'ms_supplier.id')
                        ->select('pc_recieve_raw_detail.*', 'pc_recieve_raw.recieve_raw_no', 'pc_order_raw_detail.material', 'pc_order_raw.supplier_id', 'ms_supplier.name')
                        ->where('pc_recieve_raw.status', 1)
                        ->where('ms_supplier.status', 0)
                        ->get();

        return Inertia::render('Purchase/ReturnOrder/ReturnOrderDetails', [
            'returnorderdetails' => $returnorderdetails,
            'data' => $data,
            'receive' => $receive,
            'orderRaw' => $orderRaw,
            'order' => $order,
            'supplier' => $supplier,
            'material' => $material,
            'rawProduct' => $rawProduct,
            'dataNew' => $dataNew
        ]);
   }

   public function editId($id)
   {
        $dataNew = DB::table('pc_recieve_raw_detail')
                    ->leftJoin('pc_recieve_raw', 'pc_recieve_raw_detail.pc_recieve_raw_id', '=', 'pc_recieve_raw.id')
                    ->join('pc_order_raw_detail', 'pc_recieve_raw_detail.pc_order_raw_detail_id', '=', 'pc_order_raw_detail.id')
                    ->join('pc_order_raw', 'pc_recieve_raw_detail.reff_po', '=', 'pc_order_raw.order_raw_no')
                    ->join('ms_supplier', 'pc_order_raw.supplier_id', '=', 'ms_supplier.id')
                    ->select('pc_recieve_raw_detail.*', 'pc_recieve_raw.recieve_raw_no', 'pc_order_raw_detail.material', 'pc_order_raw.supplier_id', 'ms_supplier.name')
                    ->where('pc_recieve_raw.status', 1)
                    ->where('ms_supplier.status', 0)
                    ->get();
        $return_id = ReturnRaw::find($id);
        $returnorderdetails = ReturnRawDetail::where('pc_return_raw_id', $id)
                                ->withoutTrashed()
                                ->get();
        $supplier = Supplier::where('status', 0)
                        ->withoutTrashed()
                        ->get();
        return Inertia::render('Purchase/ReturnOrder/ReturnOrderDetails', [
            'dataNew' => $dataNew,
            'return_id' => $return_id,
            'returnorderdetails' => $returnorderdetails,
            'supplier' => $supplier,
        ]);
   }

   public function destroy($id)
    {
        try {
            ReturnRawDetail::find($id)->delete();

            return response()->json(['data' => 'success deleting data'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = ReturnRawDetail::find($id);
            $qty = $request->input('qtyReturnEdit');
            $data->update([
                'qty_rtn' => $qty,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}