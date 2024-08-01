<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;

class CentralMiddleware 
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('central')->check()) {
            return redirect('/central-login');
        }

        return $next($request);
    }
}
