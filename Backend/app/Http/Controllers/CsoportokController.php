<?php

namespace App\Http\Controllers;

use App\Models\Csoportok;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CsoportokController extends Controller
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
        $validator = Validator::make($request->all(),[
            'csoport_tipus_id' => 'required|exists:csoport_tipusok,id', 
            'megnevezes' => 'required|string',
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $newRec = new Csoportok();
        $newRec->csoport_tipus_id = $request->csoport_tipus_id;
        $newRec->megnevezes = $request->megnevezes;
        $newRec->keszito_felhasznalo_id = auth()->id();
        $newRec->save();
        return response()->json(['message'=>'sikeres feltöltes'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Csoportok $csoportok)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Csoportok $csoportok)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, string $csoportId)
    {
        $csoport = Csoportok::find($csoportId);
        if ($csoport->keszito_felhasznalo_id != auth()->id())
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $validator = Validator::make($request->all(),
        [
            'megnevezes' => 'string',
            'csoport_tipus_id' => 'exists:csoport_tipusok,id',
            'keszito_felhasznalo_id' => 'exists:users,id'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        if (!empty($request->megnevezes))
        {
            $csoport->megnevezes = $request->megnevezes;
        }
        if (!empty($request->csoport_tipus_id))
        {
            $csoport->csoport_tipus_id = $request->csoport_tipus_id;
        }
        if (!empty($request->keszito_felhasznalo_id))
        {
            $csoport->keszito_felhasznalo_id = $request->keszito_felhasznalo_id;
        }
        $csoport->save();
        return response(["Message"=>"Sikeres változtatás."],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Csoportok $csoportok)
    {
        //
    }
}
