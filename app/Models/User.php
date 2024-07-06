<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'email', 'password', 'domain',
    ];

    // public static function booted() {
    //     static::created(function($user){
    //         $usertenant = Tenant::create(['id' => $user->domain]);
    //         $usertenant->domains()->create(['domain' => $user->domain . '.' . env('APP_CENTRAL_DOMAIN')]);
    //     });
    // }
}
