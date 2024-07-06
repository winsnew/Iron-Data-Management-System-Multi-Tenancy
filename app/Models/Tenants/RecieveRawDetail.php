<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecieveRawDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_recieve_raw_detail';
    protected $fillable = [
        'pc_recieve_raw_id',
        'pc_order_raw_detail_id',
        'reff_po',
        'code',
        'size',
        'weight',
        'price',
        'delivery_cost',
        'qty_rcv',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function orderDetail()
    {
        return $this->hasMany(OrderRawDetail::class, 'id', 'pc_order_raw_detail_id');
    }
    
}
