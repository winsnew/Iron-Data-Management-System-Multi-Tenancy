<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenants\StockRaw;
use App\Models\Tenants\StockRawDetail;
use App\Models\Tenants\Warehouse;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RawProductStockController extends Controller
{
    public function index()
    {
         $stockData = DB::table('stock_raw')
            ->join('ms_supplier', 'stock_raw.supplier_id', '=', 'ms_supplier.id')
            ->join('ms_raw_product', 'stock_raw.raw_product_id', '=', 'ms_raw_product.id')
            ->select('stock_raw.*', 'ms_raw_product.size', 'ms_supplier.name', 'ms_raw_product.code as raw_code', 'ms_supplier.code as supplier_code')
            ->get();     

        $warehouse = Warehouse::where('status', 0)->get();
        return Inertia::render('Stock/RawProduct/RawProductStock', [
            'stock' => $stockData,
            'warehouse' => $warehouse
        ]);
    }
    public function show($id)
    {
        $stock_raw_detail = DB::table('stock_raw_detail')
                            ->join('stock_raw', 'stock_raw_detail.stock_raw_id', '=', 'stock_raw.id')
                            ->join('ms_supplier', 'ms_supplier.id', '=', 'stock_raw.supplier_id')
                            ->join('ms_raw_product', 'ms_raw_product.id', '=', 'stock_raw.raw_product_id')
                            ->select(
                                'stock_raw_detail.*',
                                'stock_raw.code',
                                'stock_raw.material',
                                'stock_raw.weight',
                                'stock_raw.cogs',
                                'stock_raw.qty',
                                'ms_supplier.name',
                                'ms_raw_product.size',
                            )
                            ->where('ms_supplier.status', 0)
                            ->where('ms_raw_product.status', 0)
                            ->where('stock_raw_detail.stock_raw_id', $id)
                            ->whereNull('stock_raw_detail.deleted_at')
                            ->get();

        return Inertia::render('Stock/RawProduct/RawProductStockDetail', [
            'data' => $stock_raw_detail
        ]);
    }
}