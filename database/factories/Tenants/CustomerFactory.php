<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenants\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('???##')),
            'name' => $this->faker->name,
            'address' => $this->faker->Address,
            'phone' => $this->faker->phoneNumber,
            'pic' => $this->faker->name,
            'due_date' => $this->faker->numberBetween(15, 90), // Assuming payment_due is in days
            'status' => $this->faker->randomElement(['1', '0']),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}