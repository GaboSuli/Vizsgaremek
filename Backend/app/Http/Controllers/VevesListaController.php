<?php

namespace App\Http\Controllers;

use App\Models\VevesLista;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show1(string $id)
    {
        $resp = VevesLista::where("felhasznalo_id",'=',$id)->with("vevesobjektum")->with("user")->get();
        return response()->json($resp);

    }
    public function show2(string $id)
    {
        $resp = VevesLista::find($id)->with("vevesobjektum")->get();
        return response()->json($resp);
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
