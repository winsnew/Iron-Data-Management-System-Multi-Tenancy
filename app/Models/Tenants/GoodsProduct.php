<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodsProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ms_goods_product';
    protected $fillable = [
        'code',
        'name',
        'material_id',
        'quality',
        'size',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    public function material()
    {
        return $this->belongsTo(Material::class, 'material_id');
    }
}