<?php

namespace Database\Factories;

use App\Models\Kategoriak;
use App\Models\mennyisegTipusok;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alkategoriak>
 */
class AlkategoriakFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'megnevezes' => fake()->word(),
            'kategoria_id' => Kategoriak::inRandomOrder()->value('id'),
            'mennyiseg_tipus_id' => mennyisegTipusok::inRandomOrder()->value('id')
        ];
    }
}
