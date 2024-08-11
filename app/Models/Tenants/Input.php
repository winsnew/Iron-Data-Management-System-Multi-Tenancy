<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Input extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'inputs';
    protected $fillable = [
        'production_no',
        'date',
        'material_weight',
        'material_qty',
        'status',
    ];
}
