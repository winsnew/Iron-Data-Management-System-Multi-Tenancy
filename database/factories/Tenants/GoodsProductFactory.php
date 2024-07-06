<?php

namespace Database\Factories\Tenants;

use App\Models\Tenants\GoodsProduct;
use App\Models\Tenants\Material;
use App\Models\Tenants\UnitSize;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenants\GoodsProduct>
 */
class GoodsProductFactory extends Factory
{
/**
 * The name of the factory's corresponding model.
 *
 * @var string
 */
protected $model = GoodsProduct::class;

// Define shared variables
private $materialCode;
private $sizeCode;
private $objectNames = ['Door', 'Chair', 'Table', 'Whiteboard', 'Cupboard', 'Mirror', 'Lamp', 'Sofa', 'Bed', 'Desk', 'Bookshelf', 'Drawer', 'Carpet', 'Television', 'Refrigerator', 'Oven', 'Toaster', 'Clock', 'Pillow', 'Wardrobe'];

/**
 * Define the model's default state.
 *
 * @return array
 */
public function definition(): array
{

return [
        'name' => $this->faker->randomElement($this->objectNames),
        'material_id' => function ($attributes) {
            // Cek apakah ada material yang sudah ada di database
            $existingMaterial = Material::where('id', '>', 0)
                                    ->inRandomOrder()
                                    ->first();

            if ($existingMaterial) {
                // Jika ada maka akan mengembalikan id material
                $attributes['material'] = $existingMaterial->code;
                $attributes['material_id'] = $existingMaterial->id;
                return $existingMaterial->id;
            } else {
                // Jika tidak ada maka akan membuat data baru lalu mengembalikan id material
                $newMaterial = MaterialFactory::new()->create();
                $attributes['material'] = $newMaterial->code;
                $attributes['material_id'] = $newMaterial->id;
                return $newMaterial->id;
            }
        },
        'quality' => $this->faker->randomElement(['A', 'B', 'C']),
        'size' => function ($attributes) {
            $existingUnitSize = UnitSize::where('id', '>', 0)->inRandomOrder()->first();

            if ($existingUnitSize) {
                $unitSize = $existingUnitSize->unit;
            } else {
                $unitSize = UnitSizeFactory::new()->create()->unit;
            }
            $randomNumber = $this->faker->randomNumber(2);
            $randomSize = $randomNumber . 'x' . $unitSize . 'x' . $randomNumber . 'x' . $unitSize . 'x' . $randomNumber . 'x' . $unitSize;
            $sizeToCode = $randomNumber . 'X' . $randomNumber . 'X' . $randomNumber;

            $this->sizeCode = $sizeToCode;
            return $randomSize;
        },
        'code' => function ($attributes) {
            // Pastikan 'material' dan 'size' ada di dalam $attributes sebelum digunakan
            $materialCode = $attributes['material'] ?? Material::find($attributes['material_id'])->code;
            $unitSize = isset($this->sizeCode) ? $this->sizeCode : null;

            // Selanjutnya, kamu bisa menggunakan $materialCode di dalam pembentukan 'code'
            $code = str_replace(' ', '', $materialCode . $unitSize);
            return $code;
        },
        'status' => function ($attributes) {
            $status = $attributes['material'] ?? Material::find($attributes['material_id'])->status;
            return $status;
        },
        'created_at' => now(),
        'updated_at' => now(),
        'deleted_at' => null
    ];
}
}