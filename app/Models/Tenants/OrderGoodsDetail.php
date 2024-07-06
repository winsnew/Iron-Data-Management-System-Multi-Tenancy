<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderGoodsDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_order_raw';
    protected $fillable = [
        'order_raw_no',
        'date',
        'supplier_id',
        'weight_order_total',
        'price_order_total',
        'amount_order_total',
        'note',
        'status',
        'crated_at',
        'updated_at',
        'deleted_at'
    ];
}
