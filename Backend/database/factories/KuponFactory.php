<?php

namespace Database\Factories;

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
        $fakeDate1 = fake()->date();
        $indatetime = strtotime($fakeDate1);
        return [
            'kezdesi_datum' => $fakeDate1,
            'lejarasi_datum' => date_add($indatetime,DateInterval::createFromDateString("7 days")),
            'kod' => fake()->company(),
            'kedvezmeny' => random_int(20,99),
            'megjegyzes' => fake()->paragraph(),
            'hasznalasi_hely' => fake()->address(),
            'feltolto_kuponos_id' => random_int(0,1)
        ];
    }
}
