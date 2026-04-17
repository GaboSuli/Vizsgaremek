<?php

namespace App\Http\Controllers;

use App\Models\CsoportTagsag;
use App\Models\User;
use App\Models\VevesLista;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VevesListaController extends Controller
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
    public function store(User $user, Request $request)
    {
        $validator = Validator::make($request->all(),[
            'csoport_id' => 'exists:csoportok,id',
            'megnevezes' => 'required|string|min:1'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        if (!empty($request->csoport_id))
        {
            $authCheck = CsoportTagsag::where("felhasznalo_id","=",auth()->id())->where("csoport_id","=",$request->csoport_id)->first();
            if (empty($authCheck))
            {
                return response(["message"=>"Nincs jogosultságod ehhez."],403);
            }
            elseif ($authCheck->jogosultsag_szint < 1)
            {
                return response(["message"=>"Nincs jogosultságod ehhez."],403);
            }
        }
        $newRec = new VevesLista();
        $newRec->felhasznalo_id = auth()->id();
        $newRec->csoport_id = $request->csoport_id;
        $newRec->megnevezes = $request->megnevezes;
        $newRec->save();
        return response()->json(['message'=>'sikeres feltöltes'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show1(User $user, Request $request)
    {
        $resp = VevesLista::where("felhasznalo_id",'=',auth()->id())->with("vevesobjektum.alKategoria")->with("user")->get();
        if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen vevés lista."]);
        }
        else
        {
            return response()->json($resp);
        }
    }
    public function show3(User $user, Request $request, string $id)
    {
        // Check that the current user is a member of this group
        $tagsag = CsoportTagsag::where("csoport_id", $id)
            ->where("felhasznalo_id", auth()->id())
            ->first();
        if (empty($tagsag))
        {
            return response()->json(['message' => "Nincs jogosultságod ehhez."], 403);
        }

        // Return ALL lists belonging to the group (not just the current user's)
        $resp = VevesLista::where("csoport_id", $id)
            ->with(["vevesobjektum.alKategoria", "user"])
            ->get();

        return response()->json($resp);
    }
    public function showAdmin()
    {
        $user = auth()->user();
        if ($user->jogosultsag_szint > 2)
        {
            $resp = VevesLista::orderBy("updated_at","desc")->limit(100)->with("vevesobjektum")->get();
            return response($resp);
        }
        else{
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VevesLista $vevesLista)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VevesLista $vevesLista)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, string $id)
    {
        $vevesiLista = VevesLista::find($id);
        if (!empty($vevesiLista->csoport_id))
        {
            $authCheck = CsoportTagsag::where("felhasznalo_id","=",auth()->id())::where("csoport_id","=",$vevesiLista->csoport_id)->first();
            if (empty($authCheck))
            {
                return response(["message"=>"Nincs jogosultságod ehhez."],403);
            }
            elseif ($authCheck->jogosultsag_szint < 1)
            {
                return response(["message"=>"Nincs jogosultságod ehhez."],403);
            }
        }
        elseif ($vevesiLista->felhasznalo_id != auth()->id())
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $vevesiLista->delete();
        return response(["message"=>"sikeres törlés"],203);
    }
}
