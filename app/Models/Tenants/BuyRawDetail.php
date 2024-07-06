<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BuyRawDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pc_buy_raw_detail';
    protected $fillable = [
        'pc_buy_raw_id',
        'pc_recieve_raw_id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
