<?php

namespace App\Http\Controllers;

use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Http\Controllers\Controller;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CsoportTagsagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $validator = Validator::make($request->all(),
        [
            'csoport_id' => 'exists:csoportok,id',
            'felhasznalo_id' => 'exists:users,id'
        ]);
        if ($validator->fails())
        {
            return response(["success"=>false,"errors"=>$validator->errors()->toArray()],400);
        }
        $authUser = Csoportok::where("csoport_id", "=",$request->csoport_id)->first();
        if ($authUser->keszito_felhasznalo_id != auth()->id())
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $authCheck = CsoportTagsag::where("csoport_id","=",$request->csoport_id)->where("felhasznalo_id","=",$request->felhasznalo_id)->first();
        if (!$authCheck)
        {
            return response(["Message" => "Már van ilyen csoport tagság."],409);
        }
        $newRec = new CsoportTagsag();
        $newRec->csoport_id = $request->csoport_id;
        $newRec->felhasznalo_id = $request->felhasznalo_id;
        $newRec->save();
        return response(["Message"=>"Sikeres létrehozás"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, string $id)
    {
        $authUser = CsoportTagsag::where("csoport_id","=",$id)->where("felhasznalo_id","=",auth()->user())->first();
        if (empty($authUser))
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        else
        {
            $users = DB::select("SELECT users.nev, csoport_tagsag.becenev, users.profilkep_url,csoport_tagsag.created_at FROM csoport_tagsag INNER JOIN users ON csoport_tagsag.felhasznalo_id = users.id WHERE users.id = ? AND csoport_tagsag.csoport_id = ?",[auth()->id(),$id]);
            if (empty($users))
            {
                return response(["Message"=>"Nem talált."],404);
            }
            else
            {
                return response($users,200);
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CsoportTagsag $csoportTagsag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CsoportTagsag $csoportTagsag)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CsoportTagsag $csoportTagsag)
    {
        //
    }
}
