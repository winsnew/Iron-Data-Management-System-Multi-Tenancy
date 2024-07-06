<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();

        // Seed each tenant's database
        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);
            
            // Call the TenantDatabaseSeeder for each tenant
            $this->call([
                UsersTableSeeder::class,
                MaterialSeeder::class,
                UnitSizeSeeder::class,
                SupplierSeeder::class,
                RawProductSeeder::class,
                WarehouseSeeder::class,
                GoodsProductSeeder::class,
                CustomerSeeder::class,
                SemiRawProductSeeder::class,
            ]);

            tenancy()->end();
        }
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
    }
}
