<?php

namespace Database\Seeders;

use App\Models\Alkategoriak;
use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Models\Kategoriak;
use App\Models\Kupon;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First seed the temak (themes) table
        DB::table('temak')->insert([
            'megnevezes' => 'Világos',
        ]);
        DB::table('temak')->insert([
            'megnevezes' => 'Sötét',
        ]);
        DB::table('contact_tipusok')->insert([
            'megnevezes' => 'Kérdés'
        ]);
        DB::table('contact_tipusok')->insert([
            'megnevezes' => 'Hiba bejelentés'
        ]);
        DB::table('contact_tipusok')->insert([
            'megnevezes' => 'Javaslat'
        ]);
        DB::table('contact_tipusok')->insert([
            'megnevezes' => 'Eggyüttmüködés'
        ]);
        DB::table('csoport_tipusok')->insert([
            'megnevezes' => 'Család'
        ]);
        DB::table('csoport_tipusok')->insert([
            'megnevezes' => 'Eggyesület'
        ]);
        DB::table('csoport_tipusok')->insert([
            'megnevezes' => 'Vállalat'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'kg'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'g'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'dkg'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'liter'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'darab'
        ]);
        DB::table('mennyiseg_tipusok')->insert([
            'mertekegyseg' => 'centiliter'
        ]);
        // Then create the test user
        User::create([
            'nev' => 'Admin',
            'becenev' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('$€zEgyhAsMcOdE$;18:'),
            'tema_id' => 1,
            'jogosultsag_szint'=>255
        ]);
        
        $users = User::factory()->count(500)->create();
        $kupons = Kupon::factory()->count(10)->create();
        $csoportok = Csoportok::factory()->count(100)->create();
        $kategoriak = Kategoriak::factory()->count(20)->create();
        $alkategoriak = Alkategoriak::factory()->count(200)->create();
        $csoportTagsagok = CsoportTagsag::factory()->count(300)->create();
    }
}
