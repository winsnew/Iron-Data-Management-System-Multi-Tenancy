<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ms_raw_product';
    protected $fillable = [
        'code',
        'material_id',
        'size',
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public $timestamps = true;


    public function material()
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }
}