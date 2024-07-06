<?php

namespace Database\Seeders;

use App\Models\Tenants\OrderRaw;
use Illuminate\Database\Seeder;

class OrderRawSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderRaw::factory()->count(20)->create();
    }
}