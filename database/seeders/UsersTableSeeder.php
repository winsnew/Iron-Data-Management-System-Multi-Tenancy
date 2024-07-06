<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenants\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
                'name'  => 'test',
                'email' => 'test@example.com',
                'password'  => bcrypt('secret'),
                // 'role' => 'admin'
        ]);
    }
}
