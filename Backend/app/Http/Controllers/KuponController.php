<?php

namespace App\Http\Controllers;

use App\Models\Kupon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KuponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resp = Kupon::all();
        return response()->json($resp);
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
            'kezdesi_datum' => 'required|date',
            'lejarasi_datum' => 'required|date',
            'kod' => 'required|string',
            'kedvezmeny' => 'required|string',
            'megjegyzes' => 'string',
            'hasznalasi_hely' => 'required|string',
            'feltolto_kuponos_id' => 'required|exists:user,id'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $newRec = new Kupon();
        $newRec->kezdesi_datum = $request->kezdesi_datum;
        $newRec->lejarasi_datum = $request->lejarasi_datum;
        $newRec->kod = $request->kod;
        $newRec->kedvezmeny = $request->kedvezmeny;
        $newRec->megjegyzes = $request->megjegyzes;
        $newRec->hasznalasi_hely = $request->hasznalasi_hely;
        $newRec->feltolto_kuponos_id = $request->feltolto_kuponos_id;
        $newRec->save();
        return response()->json(['message'=>'sikeres feltöltes'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Kupon $kupon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kupon $kupon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kupon $kupon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kupon $kupon)
    {
        //
    }
}
