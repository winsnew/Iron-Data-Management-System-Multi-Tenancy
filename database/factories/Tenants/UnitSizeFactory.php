<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\UnitSize;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class UnitSizeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UnitSize::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'unit' => $this->faker->unique()->randomElement(['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm']),
            'status' => $this->faker->randomElement(['1', '0']),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}