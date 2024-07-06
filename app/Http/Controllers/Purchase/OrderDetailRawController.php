<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Tenants\OrderRawDetail;
use App\Models\Tenants\OrderRaw;
use App\Models\Material;
use App\Models\RawProduct;
use App\Models\Tenants\Supplier;
use App\Models\Tenants\RecieveRawDetail;
use App\Models\Tenants\RecieveRaw;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class OrderDetailRawController extends Controller
{
    public function index()
    {
        $data = DB::table('ms_material')
            ->join('ms_raw_product', 'ms_material.id', '=', 'ms_raw_product.material_id')
            ->select('*')
            ->where('ms_material.status', 0)
            ->where('ms_raw_product.status', 0)
            ->get();
        $supplier = Supplier::where('status', 0)->get();
        $orderdetailraw = OrderRawDetail::where('status', 0)->get();

        return Inertia::render('Purchase/Order/OrderDetailRawProduct', [
            'orderdetailraw' => $orderdetailraw,
            'data' => $data,
            'supplier' => $supplier,

        ]);
    }

    //responsible for get data from id in order detail || show edit page
    public function editId(Request $request, $id)
    {
        $order_id = OrderRaw::find($id);

        $data = DB::table('ms_material')
            ->join('ms_raw_product', 'ms_material.id', '=', 'ms_raw_product.material_id')
            ->select('*')
            ->where('ms_material.status', 0)
            ->where('ms_raw_product.status', 0)
            ->get();

        $supplier = Supplier::where('status', 0)->get();

        $orderdetailraw = DB::table('pc_order_raw_detail')
                        ->where('pc_order_raw_detail.pc_order_raw_id', '=', $id)
                        ->where('status', '<=' , 1)
                        ->get();

        $orderDetailId = DB::table('pc_order_raw')
                ->where('id', $id)
                ->select('order_raw_no')
                ->pluck('order_raw_no')
                ->first();

        // $dataRc = DB::table('pc_recieve_raw_detail')
        //         ->where('reff_po', $orderDetailId)
        //         ->get();
        // dd($orderDetailId);
        $dataRc = RecieveRawDetail::with('orderDetail')
                ->get();
        $dataRecieve = RecieveRaw::where('status', 1)->get();

        return Inertia::render('Purchase/Order/OrderDetailRawProduct', [
            'orderdetailraw' => $orderdetailraw,
            'data' => $data,
            'order_id' => $order_id,
            'supplier' => $supplier,
            'id' => $id,
            'dataRc' => $dataRc,
            'orderDetailId' => $orderDetailId,
            'dataRecieve' => $dataRecieve,
        ]);
    }

    public function destroy($id)
    {
        $orderId = OrderRawDetail::find($id);
        $orderId->update([
            'status' => 5,
        ]);

        // return Inertia::render('Purchase/Order/Order');
    }

    public function update(Request $request, $id)
    {
        $dataTemp = $request->input('formDataEditDetail');
        $orderDetail = OrderRawDetail::find($id);

        $request->validate([
            'formDataEditDetail.code' => 'required',
            'formDataEditDetail.material' => 'required',
            'formDataEditDetail.note' => 'required',
            'formDataEditDetail.size' => 'required',
            'formDataEditDetail.status' => 'required',
        ]);

        $orderDetail->update($request->input('formDataEditDetail'));
    }

    public function GeneralOrder()
    {
        $data = DB::table('ms_material')
            ->join('ms_raw_product', 'ms_material.id', '=', 'ms_raw_product.material_id')
            ->select('*')
            ->where('ms_material.status', 0)
            ->where('ms_raw_product.status', 0)
            ->get();
        $supplier = Supplier::where('status', 0)->get();
        $orderdetailraw = OrderRawDetail::where('status', 0)->get();

        return Inertia::render('Purchase/Order/OrderTab/GeneralOrderRawProduct', [
            'orderdetailraw' => $orderdetailraw,
            'data' => $data,
            'supplier' => $supplier,

        ]);
    }

    public function OpenOrder()
    {
        $data = DB::table('ms_material')
            ->join('ms_raw_product', 'ms_material.id', '=', 'ms_raw_product.material_id')
            ->select('*')
            ->where('ms_material.status', 0)
            ->where('ms_raw_product.status', 0)
            ->get();
        $supplier = Supplier::where('status', 0)->get();
        $orderdetailraw = OrderRawDetail::where('status', 0)->get();

        return Inertia::render('Purchase/Order/OrderTab/OpenOrderRawProduct', [
            'orderdetailraw' => $orderdetailraw,
            'data' => $data,
            'supplier' => $supplier,

        ]);
    }

}