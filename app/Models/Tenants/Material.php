<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ms_material';
    protected $fillable = [
        'code',
        'name',
        'status'
        // 'created_at',
        // 'updated_at',
        // 'deleted_at'
    ];
    public function material()
    {
        return $this->hasMany(RawProduct::class, 'material_id', 'id');
    }
}