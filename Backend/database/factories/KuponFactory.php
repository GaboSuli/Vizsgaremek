<?php

namespace Database\Factories;

use App\Models\User;
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
        $kezdes = fake()->dateTimeBetween('-1 year', 'now');
    $lejaras = fake()->dateTimeBetween($kezdes, '+1 year');

    return [
        'kezdesi_datum' => $kezdes->format('Y-m-d'),
        'lejarasi_datum' => $lejaras->format('Y-m-d'),
        'kod' => fake()->company(),
        'kedvezmeny' => random_int(20, 99),
        'megjegyzes' => implode(' ', fake()->words(random_int(0, 5))),
        'hasznalasi_hely' => fake()->country(),
        'feltolto_kuponos_id' => User::inRandomOrder()->value('id')
    ];
    }
}
