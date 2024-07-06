<?php

namespace Database\Seeders;

use App\Models\Tenants\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::factory()->count(20)->create();
    }
}