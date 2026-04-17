<?php

namespace App\Http\Controllers;

use App\Models\csoport_meghivas;
use App\Models\Csoportok;
use App\Models\CsoportTagsag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CsoportMeghivasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $resp = csoport_meghivas::all();
        return response($resp);
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
        $validator = Validator::make($request->all(),[
            'csoport_id' => 'exists:csoportok,id',
            'felhasznalo_nev' => 'exists:users,nev'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $user = auth()->user();
        $meghivottUser = User::where("nev","=",$request->felhasznalo_nev)->first();
        $csoport = Csoportok::find($request->csoport_id);
        if (empty($csoport))
        {
            return response(["message"=>"Nem talált csoport"],404);
        }
        if ($csoport->keszito_felhasznalo_id != $user->id)
        {
            return response(["message"=>"Nem a te csoportod."],403);
        }
        if (!empty(CsoportTagsag::where("felhasznalo_id","=",$meghivottUser->id)->where("csoport_id","=",$csoport->id)->first()))
        {
            return response(["message"=>"Már benne van ez a felhasználó ebben a csoportban."],400);
        }
        if (!empty(csoport_meghivas::where("felhasznalo_id","=",$meghivottUser->id)->where("csoport_id","=",$csoport->id)->first()))
        {
            return response(["message"=>"Már meg van hívva ez a felhasználó."],400);
        }
        $newRec = new csoport_meghivas();
        $newRec->csoport_id = $csoport->id;
        $newRec->felhasznalo_id = $meghivottUser->id;
        $newRec->save();
        return response(["Message"=>"Sikeres létrehozás"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(csoport_meghivas $csoport_meghivas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(csoport_meghivas $csoport_meghivas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function decide(Request $request, string $csoport_id)
    {
        $validator = Validator::make($request->all(),[
            'elfogadott' => 'required|in:0,1'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $user = auth()->user();
        $meghivas = csoport_meghivas::where("felhasznalo_id","=",$user->id)->where("csoport_id","=",$csoport_id)->first();
        if (empty($meghivas))
        {
            return response(["message"=>"Nincs ilyen csoport meghivásod"],404);
        }
        if (!empty(CsoportTagsag::where("felhasznalo_id","=",$user->id)->where("csoport_id","=",$csoport_id)->first()))
        {
            return response(["message"=>"Már benne van ez a felhasználó ebben a csoportban."],400);
        }
        $meghivas->delete();
        if ($request->elfogadott == 1)
        {
            $newRec = new CsoportTagsag();
            $newRec->felhasznalo_id = $user->id;
            $newRec->csoport_id = $csoport_id;
            $newRec->save();
            return response(["Message"=>"Sikeresen elfogadva"],201);
        }
        else
            return response(["Message"=>"Sikeresen elutasitva"],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(csoport_meghivas $csoport_meghivas)
    {
        //
    }
}
