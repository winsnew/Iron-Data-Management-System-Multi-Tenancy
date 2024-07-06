<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\BuyRawDetail;
use Inertia\Inertia;
use App\Models\BuyRaw;
use Illuminate\Support\Facades\DB;
use App\Models\RecieveRawDetail;
use App\Models\RecieveRaw;

class BuyDetailController extends Controller
{
    public function index()
    {
        $buyrawdetail = BuyRawDetail::all();
        // $warehouses = Warehouse::all();
        return Inertia::render('Purchase/Buy/BuyDetail', [
            'buyrawdetail' => $buyrawdetail,
            // 'warehouses' => $warehouses
        ]);
    }

    public function showID(Request $request, $id)
    {
        $buyrawdetail = BuyRawDetail::all();
        $reciveId = DB::table('pc_recieve_raw')
            ->where('pc_recieve_raw.id', $id)
            ->join('ms_warehouse', 'pc_recieve_raw.werehouse_id', '=', 'ms_warehouse.id')
            ->select('pc_recieve_raw.*', 'ms_warehouse.name')
            ->first();

        $receiverawdetail = DB::table('pc_recieve_raw_detail')
                            ->join('pc_recieve_raw', 'pc_recieve_raw_detail.pc_recieve_raw_id', '=', 'pc_recieve_raw.id')
                            ->join('pc_order_raw', 'pc_recieve_raw_detail.reff_po', '=', 'pc_order_raw.order_raw_no')
                            ->join('ms_supplier', 'pc_order_raw.supplier_id', '=', 'ms_supplier.id')
                            ->join('ms_warehouse', 'pc_recieve_raw.werehouse_id', '=', 'ms_warehouse.id')
                            ->join('ms_raw_product', 'pc_recieve_raw_detail.code', '=', 'ms_raw_product.code')
                            ->join('ms_material', 'ms_raw_product.material_id', '=', 'ms_material.id')
                            ->select('pc_recieve_raw_detail.*', 'ms_warehouse.name as warehousename', 'ms_supplier.name as suppliername', 'ms_supplier.type', 'ms_material.name as materialname', 'pc_recieve_raw.recieve_raw_no')
                            ->where('pc_recieve_raw_id', $id)
                            ->get();

        $returnDetail = DB::table('pc_return_raw_detail')
            ->join('pc_recieve_raw_detail', 'pc_return_raw_detail.pc_recieve_raw_detail_id', '=', 'pc_recieve_raw_detail.id')
            ->join('pc_recieve_raw', 'pc_recieve_raw_detail.pc_recieve_raw_id', '=', 'pc_recieve_raw.id')
            ->join('ms_supplier', 'pc_return_raw_detail.supplier_id', '=', 'ms_supplier.id')
            ->join('pc_return_raw', 'pc_return_raw_detail.pc_return_raw_id', '=', 'pc_return_raw.id')
            ->where('pc_recieve_raw.id', $id)
            ->where('pc_return_raw.status', 1)
            ->select('pc_return_raw_detail.*', 'ms_supplier.name', 'pc_return_raw.status', 'pc_return_raw.return_raw_no')
            ->get();

    return Inertia::render('Purchase/Buy/BuyDetail', [
            'reciveId' => $reciveId,
            'data' => $receiverawdetail,
            'buyrawdetail' => $buyrawdetail,
            'returnDetail' => $returnDetail,
     ]);
    }
}