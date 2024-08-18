<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Tenants\Input;
use App\Models\Tenants\Customer;
use Illuminate\Http\Request;

class CustomerChartController extends Controller
{
    public function product()
    {
        $data = Input::select('date', 'material_weight', 'material_qty')
        ->orderBy('date', 'asc')
        ->get();

        return response()->json($data);
    }

    public function customer()
    {
        $customers = Customer::select('id', 'name', 'address', 'phone', 'due_date','pic', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($customers);
    }
}
