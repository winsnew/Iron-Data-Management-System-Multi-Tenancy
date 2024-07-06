<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\Material;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenants\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Material::class;

    // Define Shared variables
    private $objectName = ['Kayu Jati', 'Batu Bata', 'Pasir Silika', 'Besi Cor', 'Plastik HDPE', 'Kaca Tempered', 'Keramik', 'Logam', 'Karet', 'Kayu Mahoni', 'Marmer', 'Granit', 'Aspal', 'Beton', 'Plastik Pet', 'Batu Alam', 'Kerikil', 'Alumunium', 'Tembaga'];

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('???##')),
            'name' => $this->faker->randomElement($this->objectName),
            'status' => $this->faker->randomElement(['1', '0']),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}