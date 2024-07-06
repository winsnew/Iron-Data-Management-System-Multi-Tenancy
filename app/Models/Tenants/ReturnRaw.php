<?php
namespace App\Models\Tenants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReturnRaw extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pc_return_raw';
    protected $fillable = [
        'return_raw_no',
        'date',
        'note',
        'status',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}