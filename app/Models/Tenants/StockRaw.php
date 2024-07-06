<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockRaw extends Model
{
    use HasFactory;

    protected $table = 'stock_raw';
    protected $fillable = [
        'raw_product_id',
        'code',
        'material',
        'supplier_id',
        'weight',
        'cogs',
        'qty',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
