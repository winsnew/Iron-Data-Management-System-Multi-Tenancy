<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// use Stancl\Tenancy\Contracts\Tenant;
use Stancl\Tenancy\Tenancy;
use App\Models\Tenant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        // $this->call([
        //     UsersTableSeeder::class,
        //     MaterialSeeder::class,
        //     UnitSizeSeeder::class,
        //     SupplierSeeder::class,
        //     RawProductSeeder::class,
        //     WarehouseSeeder::class,
        //     GoodsProductSeeder::class,
        //     CustomerSeeder::class,
        //     SemiRawProductSeeder::class,
        // ]);
        $this->call([
            AdminSeeder::class,
        ]);
    }
}