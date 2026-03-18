<?php

namespace Database\Factories;

use App\Models\CsoportTipusok;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Csoportok>
 */
class CsoportokFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'csoport_tipus_id' => CsoportTipusok::inRandomOrder()->value('id'),
            'megnevezes' => fake()->word(),
            'keszito_felhasznalo_id' => User::inRandomOrder()->value('id')
        ];
    }
}
