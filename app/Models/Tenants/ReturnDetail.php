<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReturnDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_return_raw_detail';
    protected $fillable = [
        'pc_return_raw_id',
        'pc_recieve_raw_detail_id',
        'supplier_id',
        'reff_rcv',
        'code',
        'material',
        'size',
        'weight',
        'price',
        'qty_rtn',
    ];
}