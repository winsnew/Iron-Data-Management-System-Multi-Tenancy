<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderRaw extends Model
{
    use HasFactory, SoftDeletes, HasEvents;
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
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }
    public function order()
    {
        return $this->hasMany(OrderRawDetail::class, 'pc_order_raw_id', 'id')->where('status', '<=', 1);
    }
}
