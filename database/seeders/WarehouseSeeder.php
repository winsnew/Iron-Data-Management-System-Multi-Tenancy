<?php

namespace Database\Seeders;

use App\Models\Tenants\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Warehouse::factory(20)->create();
    }
}