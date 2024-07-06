<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'ms_warehouse';
    protected $fillable = [
        'code',
        'name',
        'address',
        'pic',
        'desc',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
