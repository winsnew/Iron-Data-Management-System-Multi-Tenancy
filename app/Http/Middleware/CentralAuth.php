<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;


class CentralAuth
{
    public function handle($request, Closure $next, $guard = 'central')
    {
        if (!Auth::guard($guard)->check()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
