<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Symfony\Component\HttpFoundation\Response;
use Stancl\Tenancy\Facades\Tenancy;

class CheckDomainAccess
{
    public function handle(Request $request, Closure $next)
    {
         app(InitializeTenancyByDomain::class)->handle($request, function () {});

         $tenant = tenant(); 
 
         if ($tenant && $tenant->status === 'pending') {
             return response()->json(['error' => 'This domain is not active and not accessible.'], Response::HTTP_FORBIDDEN);
         }
 
         return $next($request);
    }
}
