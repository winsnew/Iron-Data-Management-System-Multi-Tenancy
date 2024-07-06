<?php

namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class RecieveRaw extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_recieve_raw';
    protected $fillable = [
        'recieve_raw_no',
        'werehouse_id',
        'weight_recieve_total',
        'amount_recieve_total',
        'note',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function warehouse()
    {
        return $this->hasMany(Warehouse::class, 'werehouse_id', 'id');
    }

    public function warehouseID()
    {
        return $this->belongsTo(Warehouse::class, 'werehouse_id', 'id');
    }
}   
