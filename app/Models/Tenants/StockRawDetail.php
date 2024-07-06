<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockRawDetail extends Model
{
    use HasFactory;

    protected $table = 'stock_raw_detail';
    protected $fillable = [
        'stock_raw_id',
        'pc_buy_raw_id',
        'pr_result_id',
        'type',
        'tr_no',
        'date',
        'qty_in',
        'qty_out',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
