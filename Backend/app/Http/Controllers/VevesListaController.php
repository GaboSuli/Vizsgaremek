<?php

namespace App\Http\Controllers;

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
    public function store(Request $request)
    {
         $validator = Validator::make($request->all(),[
            'felhasznalo_id' => 'required|exists:users,id',
            'csoport_id' => 'exists:csoportok,id'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $newRec = new VevesLista();
        $newRec->felhasznalo_id = $request->felhasznalo_id;
        $newRec->csoport_id = $request->csoport_id;
        $newRec->save();
        return response()->json(['message'=>'sikeres feltöltes'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show1(Request $request)
    {
        $resp = VevesLista::where("felhasznalo_id",'=',auth()->id())->with("vevesobjektum")->with("user")->get();
        if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen vevés lista."]);
        }
        else
        {
            return response()->json($resp);
        }
    }
    public function show3(Request $request, string $id)
    {
        
        $resp = VevesLista::where("csoport_id",$id)->whereHas('user', function ($q) {
        $q->where('id', auth()->id());
    })->with(["vevesobjektum","user"])->get();
         if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen vevés lista."]);
        }
        else
        {
            return response()->json($resp);
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
    public function destroy(VevesLista $vevesLista)
    {
        //
    }
}
