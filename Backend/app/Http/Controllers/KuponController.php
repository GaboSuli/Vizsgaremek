<?php

namespace App\Http\Controllers;

use App\Models\Kupon;
use App\Http\Controllers\Controller;
use App\Models\User;
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
    public function store(User $user, Request $request)
    {
        if (auth()->user()->jogosultsag_szint < 1)
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $validator = Validator::make($request->all(),[
            'kezdesi_datum' => 'required|date',
            'lejarasi_datum' => 'required|date',
            'kod' => 'required|string|min:1',
            'kedvezmeny' => 'required|string|min:1',
            'megjegyzes' => 'string',
            'hasznalasi_hely' => 'required|string|min:1',
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
        $newRec->feltolto_kuponos_id = auth()->id();
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
    public function update(Request $request, User $user, string $id)
    {
        if (auth()->user()->jogosultsag_szint < 1)
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $validator = Validator::make($request->all(),[
            'kezdesi_datum' => 'date',
            'lejarasi_datum' => 'date',
            'kod' => 'string|min:1',
            'kedvezmeny' => 'string|min:1',
            'megjegyzes' => 'string',
            'hasznalasi_hely' => 'string|min:1',
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $kupon = Kupon::find($id);
        if (!empty($request->kezdesi_datum))
        {
            $kupon->kezdesi_datum = $request->kezdesi_datum;
        }
        if (!empty($request->lejarasi_datum))
        {
            $kupon->lejarasi_datum = $request->lejarasi_datum;
        }
        if (!empty($request->kod))
        {
            $kupon->kod = $request->kod;
        }
        if (!empty($request->kedvezmeny))
        {
            $kupon->kedvezmeny = $request->kedvezmeny;
        }
        if (!empty($request->megjegyzes))
        {
            $kupon->megjegyzes = $request->megjegyzes;
        }
        if (!empty($request->hasznalasi_hely))
        {
            $kupon->hasznalasi_hely = $request->hasznalasi_hely;
        }
        $kupon->save();
        return response(["message"=>"sikeres változtatás"],203);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, string $id)
    {
        if (auth()->user()->jogosultsag_szint < 1)
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $kupon = Kupon::find($id);
        $kupon->delete();
        return response(["message"=>"sikeres törlés"],203);
    }
}
