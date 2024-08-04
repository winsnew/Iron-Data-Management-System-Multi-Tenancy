<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TenantAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        config(['auth.defaults.guard' => 'tenant']);
         
         if (!Auth::guard('tenant')->check()) {
            // If not authenticated, redirect to login page
            return redirect()->route('login');
        }
        return $next($request);
    }
}
