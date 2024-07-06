<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\Material;
use App\Models\Tenants\OrderRaw;
use App\Models\Tenants\OrderRawDetail;
use App\Models\Tenants\RawProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenants\OrderRawDetail>
 */
class OrderRawDetailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderRawDetail::class;

    // Define shared variables
    private $idRawProduct;
    private $description = ['Expensive', 'High Quality'];

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'pc_order_raw_id' => function () {
                return OrderRaw::where('status', 0)->inRandomOrder()->first()->id;
            },
            'raw_product_id' => function () {
                $this->idRawProduct = RawProduct::where('status', 0)->inRandomOrder()->first()->id;
                return $this->idRawProduct;
            },
            'code' => function () {
                $rawProduct = RawProduct::where('id', $this->idRawProduct)->first();
                return $rawProduct->code;
            },
            'material' => function () {
                $idMaterial = RawProduct::where('id', $this->idRawProduct)->first()->material_id;
                $material = Material::where('id', $idMaterial)->first();
                return $material->name;
            },
            'size' => function () {
                return RawProduct::where('id', $this->idRawProduct)->first()->size;
            },
            'status' => $this->faker->randomElement(['1', '0']),
            'note' => $this->faker->randomElement($this->description),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null
        ];
   }
}