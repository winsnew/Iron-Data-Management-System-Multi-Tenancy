<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Tenants\OrderRawDetail;
use Illuminate\Database\Seeder;

class OrderRawDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderRawDetail::factory()->count(20)->create();
    }
}