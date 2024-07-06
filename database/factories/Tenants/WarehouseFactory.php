<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Warehouse::class;

    // Define shared variables
    private $description = ['Raw Product', 'Goods Product'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('???##')),
            'name' => $this->faker->company . ' Warehouse',
            'address' => $this->faker->address,
            'pic' => $this->faker->name,
            'desc' => $this->faker->randomElement($this->description),
            'status' => $this->faker->randomElement(['0', '1']),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null, // assuming deleted_at can be null initially
        ];
    }
}