<?php

namespace App\Http\Controllers\ManageTenant;

use App\Http\Controllers\Controller;
use App\Models\UserCentral;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserTenantController extends Controller
{
    public function index()
    {
        $tenantUser = UserCentral::all();
        $formattedUsers = $tenantUser->map(function ($user) {
            $user->created_at->format('Y-m-d');
            return $user;
        });
        return response()->json($formattedUsers);
    }
}
