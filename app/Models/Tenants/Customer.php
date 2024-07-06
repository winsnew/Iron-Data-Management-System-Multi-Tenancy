<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ms_customer';
    protected $fillable = [
        'code',
        'name',
        'address',
        'phone',
        'pic',
        'due_date',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
