<?php

namespace Database\Factories;

use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CsoportTagsag>
 */
class CsoportTagsagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $csoport = Csoportok::inRandomOrder()->first();

    if (!$csoport) {
        throw new \Exception('No groups found');
    }

    $existingUserIds = CsoportTagsag::where('csoport_id', $csoport->id)
        ->pluck('felhasznalo_id');

    $user = User::where('id', '!=', $csoport->creator_id)
        ->whereNotIn('id', $existingUserIds)
        ->inRandomOrder()
        ->first();

    if (!$user) {
        throw new \Exception('No valid users left for this group');
    }

    return [
        'felhasznalo_id' => $user->id,
        'csoport_id' => $csoport->id,
        'jogosultsag_szint' => random_int(0, 1),
    ];
}
}
