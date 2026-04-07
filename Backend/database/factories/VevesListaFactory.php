<?php

namespace Database\Factories;

use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VevesLista>
 */
class VevesListaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $decide = random_int(1,2);
        if ($decide == 1)
        {
            $csoportId = Csoportok::inRandomOrder()->value('id');
            $existingUser = CsoportTagsag::where("csoport_id","=",$csoportId)->inRandomOrder()->value("felhasznalo_id");
            if ($existingUser == null)
            {
                $existingUser = Csoportok::find($csoportId)->value('keszito_felhasznalo_id');
            }
            return [
                        'felhasznalo_id' => $existingUser,
                        'csoport_id' => $csoportId,
                        'megnevezes' => fake()->word()
                    ];
        }
        return [
            'felhasznalo_id' => User::inRandomOrder()->value('id'),
            'csoport_id' => null,
            'megnevezes' => fake()->word()
        ];
    }
}
