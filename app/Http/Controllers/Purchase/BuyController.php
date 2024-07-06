<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Tenants\RecieveRawDetail;
use Illuminate\Http\Request;
use App\Models\Tenants\BuyRaw;
use App\Models\Tenants\BuyRawDetail;
use Inertia\Inertia;
use App\Models\Tenants\RecieveRaw;
use App\Models\Tenants\OrderRaw;
use App\Models\Tenants\OrderRawDetail;
use App\Models\Tenants\Supplier;
use App\Models\Tenants\ReturnRaw;
use App\Models\Tenants\ReturnRawDetail;
use App\Models\Tenants\StockRaw;
use App\Models\Tenants\StockRawDetail;
use Illuminate\Support\Facades\DB;

class BuyController extends Controller
{
    public function index()
    {
        // Mengambil data dari pc_recieve_raw dengan memanfaatkan relasi di model BuyRaw
        $buyData = BuyRaw::all();
        $receive = DB::table('pc_recieve_raw')
            ->join('ms_warehouse', 'ms_warehouse.id', '=', 'pc_recieve_raw.werehouse_id')
            ->where('pc_recieve_raw.status', 1)
            ->select('pc_recieve_raw.*', 'ms_warehouse.name')
            ->get();
        $receiveraw = RecieveRawDetail::withoutTrashed()->get();

        //order
        $orderrawdetail = OrderRawDetail::all();
        $orderraw = OrderRaw::all();

        //supplier
        $supplier = Supplier::where('status', 0)->get();

        //mengambil data dari return order
        $return = ReturnRaw::where('status', 1)->get();
        $returnraw = ReturnRawDetail::withoutTrashed()->get();

        
        // Mengirimkan data ke view menggunakan Inertia
        return Inertia::render('Purchase/Buy/Buy', [
        'buy' => $buyData,
        'Receive' => $receive,
        'Supplier' => $supplier,
        'ReceiveRaw' => $receiveraw,
        'OrderRawDetail' => $orderrawdetail,
        'OrderRaw' => $orderraw,    
        'Return' => $return,
        'ReturnRaw' => $returnraw,
        ]);
    }
    public function store(Request $request) 
    {
        try {
            DB::beginTransaction();
            $items = $request->input('selectedItemsDetails');

            if ($items) {
                foreach ($items as $item) {

                    $br = 'BR-' . date('YmdHis');
                    $buyRaw = BuyRaw::create([
                        'buy_raw_no' => $br,
                        'date' => now(), // Use now() to get the current date and time
                    ]);

                    $newlyCreatedIdsBuy = $buyRaw->id; //get fresh buy row id

                    $buyRawDetail = BuyRawDetail::create([
                        'pc_buy_raw_id' => $newlyCreatedIdsBuy,
                        'pc_recieve_raw_id' => $item['id'], // Use now() to get the current date and time
                    ]);

                    $raw_product_id = DB::table('pc_recieve_raw')
                        ->join('pc_recieve_raw_detail', 'pc_recieve_raw.id', '=', 'pc_recieve_raw_detail.pc_recieve_raw_id')
                        ->join('pc_order_raw_detail', 'pc_recieve_raw_detail.pc_order_raw_detail_id', '=', 'pc_order_raw_detail.id')
                        ->join('ms_raw_product', 'pc_order_raw_detail.raw_product_id', '=', 'ms_raw_product.id')
                        ->join('ms_material', 'ms_raw_product.material_id', '=', 'ms_material.id')
                        ->join('pc_order_raw', 'pc_order_raw_detail.pc_order_raw_id', '=', 'pc_order_raw.id')
                        ->join('ms_supplier', 'pc_order_raw.supplier_id', '=', 'ms_supplier.id')
                        ->leftJoin('pc_return_raw_detail', 'pc_recieve_raw_detail.id', 'pc_return_raw_detail.pc_recieve_raw_detail_id')
                        ->where('pc_recieve_raw.id', $item['id'])
                        ->where('ms_raw_product.status', 0)
                        ->select('ms_raw_product.id', 'ms_raw_product.code', 'ms_material.name', 'pc_order_raw.supplier_id', 'pc_recieve_raw_detail.weight', 'pc_recieve_raw_detail.price', 'pc_recieve_raw_detail.qty_rcv', 'pc_return_raw_detail.qty_rtn', 'pc_recieve_raw.id AS receive_id')
                        ->get();
                    // dd($raw_product_id);
                    foreach($raw_product_id as $itemId) {
                        $stockRaw = null;
                        $saveStockRaw = null;
                        $combinationKey = $itemId->code . '-' . $itemId->weight . '-' . $itemId->price;

                        $stockRawExist = DB::table('stock_raw')
                            ->select('stock_raw.id', 'stock_raw.qty')
                            ->where('stock_raw.code', $combinationKey)
                            ->first();

                        $codeMatchStock = DB::table('stock_raw')
                            ->join('stock_raw_detail', 'stock_raw.id', '=', 'stock_raw_detail.stock_raw_id')
                            ->where('stock_raw.code', $combinationKey)
                            ->sum('stock_raw_detail.qty_in');

                        $checkDataExist = DB::table('stock_raw')
                            ->where('code', $combinationKey)
                            ->exists();

                        $getCheckDataExist = DB::table('stock_raw')
                            ->where('code', $combinationKey)
                            ->first();

                        if($getCheckDataExist) {
                            $qtyIn = DB::table('stock_raw_detail')
                                ->where('stock_raw_id', $getCheckDataExist->id)
                                ->latest()
                                ->first();
                        }

                        $sumRcvColumn = DB::table('pc_recieve_raw_detail')
                            ->select(DB::raw("*, CONCAT(code, '-', weight, '-', price) AS combine"))
                            ->having('combine', $combinationKey)
                            ->where('pc_recieve_raw_id', $itemId->receive_id)
                            ->sum('qty_rcv');

                        // dd(intval($sumRcvColumn));
                        
                        if (!isset($uniqueCombinations[$combinationKey])) {
                            if ($checkDataExist) {
                                    $stockRaw = StockRaw::updateOrCreate(
                                        [
                                            'code' => $itemId->code . '-' . $itemId->weight . '-' . $itemId->price,
                                        ],
                                        [
                                            // 'raw_product_id' => $itemId->id, //need diynamiccly add data
                                            // 'code' => $itemId->code . '-' . $itemId->weight . '-' . $itemId->price,
                                            // 'material' => $itemId->name,
                                            // 'supplier_id' => $itemId->supplier_id, //need diynamiccly add data
                                            // 'weight' => $itemId->weight,
                                            // 'cogs' => $itemId->price,
                                            // 'qty' => $stockRawExist->qty + $qtyIn->qty_in,
                                        ]
                                );
                            } else {
                                $stockRaw = StockRaw::create([
                                            'raw_product_id' => $itemId->id, //need diynamiccly add data
                                            'code' => $itemId->code . '-' . $itemId->weight . '-' . $itemId->price,
                                            'material' => $itemId->name,
                                            'supplier_id' => $itemId->supplier_id, //need diynamiccly add data
                                            'weight' => $itemId->weight,
                                            'cogs' => $itemId->price,
                                            'qty' => $stockRawExist ? intval($sumRcvColumn) : intval($sumRcvColumn) - $itemId->qty_rtn,
                                        ]);
                            }
                        // Mark the combination as processed
                            $uniqueCombinations[$combinationKey] = true;
                        }
                        // Store the newly created StockRaw ID in the $newlyCreatedIds array

                        if ($stockRaw) {
                            $newlyCreatedIds[] = $stockRaw->id;
                        }


                        if($stockRaw) {
                            $stockRawDetail = StockRawDetail::create([
                                'stock_raw_id' => $stockRaw->id,
                                'pc_buy_raw_id' => $newlyCreatedIdsBuy,
                                'pr_result_id' => '0',
                                'type' => '0',
                                'tr_no' => 'TR-' . date('YmdHis'),
                                'date' => now(),
                                'qty_in' => $stockRaw->code == $combinationKey
                                        ? intval($sumRcvColumn) - $itemId->qty_rtn
                                        : intval($sumRcvColumn),
                                'qty_out' => '0',
                            ]);
                            $newlyCreatedIdsDetail[] = $stockRawDetail->id;

                            if ($stockRawDetail->stock_raw_id == $stockRaw->id) {
                                    $stockRaw = StockRaw::updateOrCreate(
                                        [
                                            'code' => $itemId->code . '-' . $itemId->weight . '-' . $itemId->price,
                                        ],
                                        [
                                            'qty' => $getCheckDataExist ? $stockRaw->qty + $stockRawDetail->qty_in : $stockRaw->qty,
                                        ]
                                );
                            }
                        }
                        
                    $return = DB::table('pc_recieve_raw')
                        ->join('pc_recieve_raw_detail', 'pc_recieve_raw.id', '=', 'pc_recieve_raw_detail.pc_recieve_raw_id')
                        ->join('pc_return_raw_detail', 'pc_recieve_raw_detail.id', '=', 'pc_return_raw_detail.pc_recieve_raw_detail_id')
                        ->join('pc_return_raw', 'pc_return_raw_detail.pc_return_raw_id', '=', 'pc_return_raw.id')
                        ->where('pc_recieve_raw.id', $item['id'])
                        ->select('pc_return_raw.id')
                        ->first();

                    if ($return) {
                        $returnUpdate = ReturnRaw::find($return->id);
                        $returnUpdate->update([
                            'status' => 2,
                        ]);
                    }

                    $receive = DB::table('pc_recieve_raw')
                        ->where('id', $item['id'])
                        ->first();

                    $receiveUpdate = RecieveRaw::find($receive->id);
                    $receiveUpdate->update([
                        'status' => 2,
                    ]);

                    }
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
}