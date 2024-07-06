<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class BuyRaw extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $table = 'pc_buy_raw';
    protected $fillable = [
        'buy_raw_no',
        'date',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
