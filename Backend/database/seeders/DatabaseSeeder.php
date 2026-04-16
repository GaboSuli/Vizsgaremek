<?php

namespace Database\Seeders;

use App\Models\Alkategoriak;
use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Models\Kategoriak;
use App\Models\Kupon;
use App\Models\User;
use App\Models\VevesLista;
use App\Models\VevesObjektum;
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
        $mertekegysegek = [
    "kg", "dkg", "g",
    "liter", "milliliter",
    "darab", "csomag", "doboz",
    "üveg", "konzerv",
    "centiliter", "deciliter",
    "tekercs", "pár", "szett",
    "óra",
    "nap",
    "hónap",
    "alkalom",
    "km",
    "kWh",
    "m3",
    "GB"
];

$categories = [
    "Ital" => [
        "Ásványvíz" => ["mertekegyseg_id" => 3],
        "Szénsavas üdítő" => ["mertekegyseg_id" => 3],
        "Szénsavmentes üdítő" => ["mertekegyseg_id" => 3],
        "Gyümölcslé" => ["mertekegyseg_id" => 3],
        "Ice Tea" => ["mertekegyseg_id" => 3],
        "Energiaital" => ["mertekegyseg_id" => 4],
        "Kávéital" => ["mertekegyseg_id" => 4],
        "Szirup" => ["mertekegyseg_id" => 8]
    ],

    "Tejtermék" => [
        "Tej" => ["mertekegyseg_id" => 3],
        "Laktózmentes tej" => ["mertekegyseg_id" => 3],
        "Sajt kemény" => ["mertekegyseg_id" => 1],
        "Sajt lágy" => ["mertekegyseg_id" => 1],
        "Reszelt sajt" => ["mertekegyseg_id" => 6],
        "Jogurt" => ["mertekegyseg_id" => 5],
        "Görög jogurt" => ["mertekegyseg_id" => 5],
        "Tejföl" => ["mertekegyseg_id" => 5],
        "Vaj" => ["mertekegyseg_id" => 1],
        "Margarin" => ["mertekegyseg_id" => 1],
        "Túró" => ["mertekegyseg_id" => 1],
        "Tejszín" => ["mertekegyseg_id" => 4]
    ],

    "Hús és hal" => [
        "Csirkehús" => ["mertekegyseg_id" => 0],
        "Sertéshús" => ["mertekegyseg_id" => 0],
        "Marhahús" => ["mertekegyseg_id" => 0],
        "Pulykahús" => ["mertekegyseg_id" => 0],
        "Darálthús" => ["mertekegyseg_id" => 0],
        "Hal friss" => ["mertekegyseg_id" => 0],
        "Hal fagyasztott" => ["mertekegyseg_id" => 6],
        "Tenger gyümölcsei" => ["mertekegyseg_id" => 6]
    ],

    "Felvágott és kész hús" => [
        "Sonka" => ["mertekegyseg_id" => 1],
        "Szalámi" => ["mertekegyseg_id" => 1],
        "Kolbász" => ["mertekegyseg_id" => 1],
        "Virslí" => ["mertekegyseg_id" => 1],
        "Pástétom" => ["mertekegyseg_id" => 9]
    ],

    "Pékáru" => [
        "Kenyér fehér" => ["mertekegyseg_id" => 5],
        "Kenyér teljes kiőrlésű" => ["mertekegyseg_id" => 5],
        "Zsemle" => ["mertekegyseg_id" => 5],
        "Kifli" => ["mertekegyseg_id" => 5],
        "Péksütemény édes" => ["mertekegyseg_id" => 5],
        "Péksütemény sós" => ["mertekegyseg_id" => 5],
        "Toast kenyér" => ["mertekegyseg_id" => 6]
    ],

    "Zöldség" => [
        "Paradicsom" => ["mertekegyseg_id" => 0],
        "Paprika" => ["mertekegyseg_id" => 0],
        "Uborka" => ["mertekegyseg_id" => 0],
        "Krumpli" => ["mertekegyseg_id" => 0],
        "Hagyma" => ["mertekegyseg_id" => 0],
        "Répa" => ["mertekegyseg_id" => 0],
        "Saláta" => ["mertekegyseg_id" => 5]
    ],

    "Gyümölcs" => [
        "Alma" => ["mertekegyseg_id" => 0],
        "Banán" => ["mertekegyseg_id" => 0],
        "Narancs" => ["mertekegyseg_id" => 0],
        "Mandarin" => ["mertekegyseg_id" => 0],
        "Szőlő" => ["mertekegyseg_id" => 0],
        "Bogyós gyümölcs" => ["mertekegyseg_id" => 6]
    ],

    "Szárazáru és alapanyag" => [
        "Liszt" => ["mertekegyseg_id" => 0],
        "Cukor" => ["mertekegyseg_id" => 0],
        "Barna cukor" => ["mertekegyseg_id" => 0],
        "Só" => ["mertekegyseg_id" => 2],
        "Rizs" => ["mertekegyseg_id" => 0],
        "Tészta" => ["mertekegyseg_id" => 6],
        "Zabpehely" => ["mertekegyseg_id" => 0],
        "Müzli" => ["mertekegyseg_id" => 6]
    ],

    "Konzerv és tartós" => [
        "Konzerv hús" => ["mertekegyseg_id" => 9],
        "Konzerv bab" => ["mertekegyseg_id" => 9],
        "Konzerv kukorica" => ["mertekegyseg_id" => 9],
        "Savanyúság" => ["mertekegyseg_id" => 8],
        "Lekvár" => ["mertekegyseg_id" => 8],
        "Méz" => ["mertekegyseg_id" => 8]
    ],

    "Fagyasztott" => [
        "Fagyasztott zöldség" => ["mertekegyseg_id" => 6],
        "Fagyasztott gyümölcs" => ["mertekegyseg_id" => 6],
        "Pizza" => ["mertekegyseg_id" => 5],
        "Hasábburgonya" => ["mertekegyseg_id" => 6],
        "Jégkrém" => ["mertekegyseg_id" => 5]
    ],

    "Édesség és snack" => [
        "Csokoládé" => ["mertekegyseg_id" => 5],
        "Keksz" => ["mertekegyseg_id" => 6],
        "Chips" => ["mertekegyseg_id" => 6],
        "Cukorka" => ["mertekegyseg_id" => 2],
        "Rágógumi" => ["mertekegyseg_id" => 5],
        "Magvak" => ["mertekegyseg_id" => 1]
    ],

    "Fűszerek és szószok" => [
        "Fűszer" => ["mertekegyseg_id" => 2],
        "Őrölt fűszer" => ["mertekegyseg_id" => 2],
        "Szósz" => ["mertekegyseg_id" => 8],
        "Ketchup" => ["mertekegyseg_id" => 8],
        "Mustár" => ["mertekegyseg_id" => 8],
        "Majonéz" => ["mertekegyseg_id" => 8]
    ],

    "Diétás és speciális" => [
        "Gluténmentes termék" => ["mertekegyseg_id" => 6],
        "Laktózmentes termék" => ["mertekegyseg_id" => 6],
        "Vegán termék" => ["mertekegyseg_id" => 6],
        "Bio termék" => ["mertekegyseg_id" => 6],
        "Fehérje termék" => ["mertekegyseg_id" => 6]
    ],
    "Közlekedés" => [
        "Benzin" => ["mertekegyseg_id" => 3],
        "Gázolaj" => ["mertekegyseg_id" => 3],
        "Autógáz" => ["mertekegyseg_id" => 3],
        "Tömegközlekedési jegy" => ["mertekegyseg_id" => 5],
        "Bérlet" => ["mertekegyseg_id" => 17],
        "Taxi" => ["mertekegyseg_id" => 19],
        "Autóbérlés" => ["mertekegyseg_id" => 16],
        "Parkolás" => ["mertekegyseg_id" => 15]
    ],
    "Lakhatás és rezsi" => [
        "Villany" => ["mertekegyseg_id" => 20],
        "Gáz" => ["mertekegyseg_id" => 21],
        "Víz" => ["mertekegyseg_id" => 21],
        "Internet" => ["mertekegyseg_id" => 17],
        "Mobil előfizetés" => ["mertekegyseg_id" => 17],
        "Közös költség" => ["mertekegyseg_id" => 17],
        "Lakbér" => ["mertekegyseg_id" => 17],
        "Hitel törlesztés" => ["mertekegyseg_id" => 17]
    ],

    "Egészség" => [
        "Gyógyszer" => ["mertekegyseg_id" => 5],
        "Vitamin" => ["mertekegyseg_id" => 5],
        "Orvosi vizsgálat" => ["mertekegyseg_id" => 18],
        "Magánrendelés" => ["mertekegyseg_id" => 18],
        "Fogászat" => ["mertekegyseg_id" => 18],
        "Szemüveg" => ["mertekegyseg_id" => 5]
    ],

    "Szenvedélyek" => [
        "Dohány" => ["mertekegyseg_id" => 6],
        "Cigaretta" => ["mertekegyseg_id" => 6],
        "E-cigaretta" => ["mertekegyseg_id" => 5],
        "Alkohol" => ["mertekegyseg_id" => 8],
        "Sör" => ["mertekegyseg_id" => 8],
        "Bor" => ["mertekegyseg_id" => 8],
        "Rövidital" => ["mertekegyseg_id" => 8]
    ],

    "Szórakozás" => [
        "Mozi" => ["mertekegyseg_id" => 5],
        "Streaming előfizetés" => ["mertekegyseg_id" => 17],
        "Játék" => ["mertekegyseg_id" => 5],
        "Koncert" => ["mertekegyseg_id" => 5],
        "Fesztivál" => ["mertekegyseg_id" => 5]
    ],

    "Ruházat" => [
        "Felsőruházat" => ["mertekegyseg_id" => 5],
        "Alsóruházat" => ["mertekegyseg_id" => 5],
        "Cipő" => ["mertekegyseg_id" => 5],
        "Kiegészítők" => ["mertekegyseg_id" => 5]
    ],

    "Technológia" => [
        "Mobiltelefon" => ["mertekegyseg_id" => 5],
        "Laptop" => ["mertekegyseg_id" => 5],
        "Előfizetés (szoftver)" => ["mertekegyseg_id" => 17],
        "Alkalmazás" => ["mertekegyseg_id" => 5],
        "Javítás" => ["mertekegyseg_id" => 18]
    ],

    "Oktatás" => [
        "Tandíj" => ["mertekegyseg_id" => 17],
        "Tanfolyam" => ["mertekegyseg_id" => 18],
        "Könyv" => ["mertekegyseg_id" => 5],
        "Online kurzus" => ["mertekegyseg_id" => 18]
    ],

    "Szolgáltatások" => [
        "Fodrász" => ["mertekegyseg_id" => 18],
        "Kozmetikus" => ["mertekegyseg_id" => 18],
        "Szerelő" => ["mertekegyseg_id" => 18],
        "Takarítás" => ["mertekegyseg_id" => 18],
        "Szállítás" => ["mertekegyseg_id" => 18]
    ],

    "Pénzügy" => [
        "Banki díj" => ["mertekegyseg_id" => 18],
        "Biztosítás" => ["mertekegyseg_id" => 17],
        "Befektetés" => ["mertekegyseg_id" => 18],
        "Adó" => ["mertekegyseg_id" => 18]
    ],

    "Utazás" => [
        "Szállás" => ["mertekegyseg_id" => 16],
        "Repülőjegy" => ["mertekegyseg_id" => 5],
        "Program" => ["mertekegyseg_id" => 18],
        "Biztosítás" => ["mertekegyseg_id" => 16]
    ],

    "Ajándék" => [
        "Születésnap" => ["mertekegyseg_id" => 5],
        "Karácsony" => ["mertekegyseg_id" => 5],
        "Egyéb ajándék" => ["mertekegyseg_id" => 5]
    ]

];
foreach ($mertekegysegek as $value) {
    DB::table('mennyiseg_tipusok')->insert([
        'mertekegyseg' => $value 
    ]);
}
foreach ($categories as $key => $value) {
    $index = DB::table('kategoriak')->insertGetId([
        'megnevezes' => $key
    ]);
    foreach ($value as $key2 => $value2) {
        DB::table('alkategoriak')->insert([
            'megnevezes' => $key2,
            'kategoria_id' => $index,
            'mennyiseg_tipus_id' => $value2["mertekegyseg_id"]+1
        ]);
    }
}
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
        
        $users = User::factory()->count(100)->create();
        $kupons = Kupon::factory()->count(10)->create();
        $csoportok = Csoportok::factory()->count(100)->create();
        foreach ($csoportok as $key => $value) {
            $newrec = new CsoportTagsag();
            $newrec->felhasznalo_id = $value->keszito_felhasznalo_id;
            $newrec->csoport_id = $value->id;
            $newrec->jogosultsag_szint = 3;
            $newrec->save();
        }
        $csoportTagsagok = CsoportTagsag::factory()->count(300)->create();
        $vevesListak = VevesLista::factory()->count(1000)->create();
        $vevesObjektumok = VevesObjektum::factory()->count(10000)->create();
    }
}
