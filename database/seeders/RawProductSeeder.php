<?php

namespace Database\Seeders;

use App\Models\Tenants\RawProduct;
use Illuminate\Database\Seeder;

class RawProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RawProduct::factory()->count(20)->create();
    }
}