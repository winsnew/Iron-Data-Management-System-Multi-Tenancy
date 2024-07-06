<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderRawDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_order_raw_detail';
    protected $fillable = [
        'pc_order_raw_id',
        'raw_product_id',
        'code',
        'material',
        'size',
        'status',
        'note',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    public function orderRaw()
    {
        return $this->belongsTo(OrderRaw::class, 'id');
    }

    public function rawProduct()
    {
        return $this->belongsTo(RawProduct::class, 'id');
    }
    public function RecieveDetail()
    {
        return $this->belongsTo(RecieveRawDetail::class, 'id', 'pc_order_raw_detail_id');
    }
}