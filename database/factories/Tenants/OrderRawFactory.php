<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\OrderRaw;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tenants\Supplier;

class OrderRawFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderRaw::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_raw_no' => 'PO-'.$this->faker->date,
            'date' => $this->faker->date,
            'supplier_id' => function () {
                return Supplier::where('status', 0)->inRandomOrder()->first()->id;
            },
            'weight_order_total' => $this->faker->randomFloat(2, 10, 100),
            'price_order_total' => $this->faker->randomFloat(2, 100, 1000),
            'amount_order_total' => $this->faker->randomFloat(2, 100, 1000),
            'note' => $this->faker->sentence,
            'status' => $this->faker->randomElement(['1', '0']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}