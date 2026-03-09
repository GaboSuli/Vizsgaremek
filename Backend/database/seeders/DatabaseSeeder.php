<?php

namespace Database\Seeders;

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
        // Then create the test user
        User::create([
            'nev' => 'Admin',
            'becenev' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('$RandomHashCode1℃'),
            'tema_id' => 1,
            'jogosultsag_szint'=>255
        ]);
        
        $users = User::factory()->count(25)->create();
    }
}
