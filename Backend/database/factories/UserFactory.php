<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

            $csaladnevek = [
            "Kovács", "Szabó", "Tóth", "Nagy", "Horváth", "Varga", "Kiss", "Molnár",
            "Németh", "Farkas", "Balogh", "Papp", "Lakatos", "Takács", "Juhász",
            "Mészáros", "Oláh", "Simon", "Rácz", "Fekete", "Szűcs", "Boros",
            "Kelemen", "Antal", "Sipos", "Bognár", "Gáspár", "Péter", "Kocsis",
            "Katona", "Szilágyi", "Veres", "Kardos", "Vincze", "Hegedűs", "Sánta",
            "Orbán", "Szekeres", "Barta", "Bíró", "Király", "Major", "Pál",
            "Gulyás", "Székely", "Bencsik", "Barna", "Cseh", "Fodor", "Hajdú",
            "Kádár", "Kertész", "Kis", "Lukács", "Madarász", "Nyíri", "Pintér"
        ];

        $keresztnevek = [
            "Ádám", "Bence", "Csaba", "Dániel", "Erik", "Ferenc", "Gábor", "Hunor",
            "István", "János", "Károly", "László", "Máté", "Norbert", "Olivér",
            "Péter", "Richárd", "Sándor", "Tamás", "Viktor", "Zoltán", "Balázs",
            "Cintia", "Dóra", "Emese", "Fanni", "Gabriella", "Hanna", "Ilona",
            "Judit", "Katalin", "Lili", "Mónika", "Noémi", "Orsolya", "Petra",
            "Réka", "Szilvia", "Tímea", "Vanda", "Zsófia", "Anita", "Beáta",
            "Csilla", "Diána", "Eszter", "Flóra", "Gréta", "Helga", "Ivett",
            "Jázmin", "Kinga", "Luca", "Melinda", "Nikolett", "Vivien"
        ];

        return [
            'nev' => fake()->randomElement($csaladnevek) . ' ' . fake()->randomElement($keresztnevek),
            'becenev' => fake()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'tema_id' => random_int(1,2),
            'kuponok' => random_int(0,1),
            'termekArKovetes' => random_int(0,1),
            'brokerArKovetes' => random_int(0,1)
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
