<?php

namespace Database\Seeders;

use App\Models\Tenants\UnitSize;
use Illuminate\Database\Seeder;

class UnitSizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UnitSize::factory()->count(7)->create();
    }
}