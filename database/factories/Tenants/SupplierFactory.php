<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Supplier::class;

    // Define Shared variables
    private $company = [
        'JNE',
        'JNT',
        'DHL Express',
        'FedEx',
        'UPS',
        'Royal Mail',
        'China Post',
        'USPS',
        'TNT Express',
        'United States Postal Service (USPS)',
        'Royal Mail',
        'China Post',
        'Japan Post',
        'Deutsche Post DHL',
        'Canada Post',
        'Australia Post',
        'La Poste (France)',
        'Swiss Post',
        'Poste Italiane',
        'Correos (Spain)',
        'India Post',
        'EMS Russian Post',
        'Pos Indonesia',
        'Brazil Correios',
        'South African Post Office'
    ];

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('???##')),
            'name' => $this->faker->randomElement($this->company),
            'type' => $this->faker->randomElement(['0', '1']),
            'pic' => $this->faker->name,
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'payment_due' => $this->faker->numberBetween(15, 90), // Assuming payment_due is in days
            // Adjust the 'status' field to use integer values
            'status' => $this->faker->randomElement([0, 1]),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}