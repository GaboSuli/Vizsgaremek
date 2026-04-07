<?php

namespace Database\Factories;

use App\Models\Alkategoriak;
use App\Models\VevesLista;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VevesObjektum>
 */
class VevesObjektumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "veves_lista_id" => VevesLista::inRandomOrder()->value('id'),
            "alKategoria_id" => Alkategoriak::inRandomOrder()->value('id'),
            "megnevezes" => fake()->word(),
            "ar" => random_int(1,500000),
            "mennyiseg" => random_int(1,200),
            "elfogadott_statisztikara" => random_int(1,2)==1
        ];
    }
}
