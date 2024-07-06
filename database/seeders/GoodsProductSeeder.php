<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Tenants\GoodsProduct;
use Illuminate\Database\Seeder;

class GoodsProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GoodsProduct::factory()->count(20)->create();
    }
}