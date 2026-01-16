<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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
    public function show(string $id)
    {
        $resp = User::where("id",'=',$id)->with("csoportok")->get();
        return response()->json($resp);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $csoportok)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $csoportok)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $csoportok)
    {
        //
    }
}
