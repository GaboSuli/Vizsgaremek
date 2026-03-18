<?php

namespace Database\Factories;

use App\Models\User;
use DateInterval;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kupon>
 */
class KuponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kezdesi_datum' => fake()->date(),
            'lejarasi_datum' => fake()->date(),
            'kod' => fake()->word(),
            'kedvezmeny' => random_int(20,99),
            'megjegyzes' => fake()->paragraph(),
            'hasznalasi_hely' => fake()->url(),
            'feltolto_kuponos_id' => User::inRandomOrder()->value('id')
        ];
    }
}
