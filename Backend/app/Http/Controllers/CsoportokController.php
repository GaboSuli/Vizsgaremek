<?php

namespace App\Http\Controllers;

use App\Models\Csoportok;
use App\Http\Controllers\Controller;
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
            'keszito_felhasznalo_id' => 'required|exists:user,id'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
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
    public function update(Request $request, Csoportok $csoportok)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Csoportok $csoportok)
    {
        //
    }
}
