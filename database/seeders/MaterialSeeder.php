<?php

namespace Database\Seeders;

use App\Models\Tenants\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Material::factory()->count(20)->create();
        // Material::create([
        //     'code' => 'test',
        //     'name' => 'test',
        //     'status' => 'test'
        // ]);
    }
}