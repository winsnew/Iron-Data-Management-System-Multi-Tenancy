<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitSize extends Model
{
    use HasFactory;

    protected $table = "ms_unit_sizes";
    protected $fillable = [
        'unit',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
