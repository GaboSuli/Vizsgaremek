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

        // Then create the test user
        User::create([
            'nev' => 'Test User',
            'becenev' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'tema_id' => 1,
        ]);
    }
}
