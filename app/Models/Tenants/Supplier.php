<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "ms_supplier";
    protected $fillable = [
        'code',
        'name',
        'type',
        'pic',
        'address',
        'phone',
        'payment_due',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

}