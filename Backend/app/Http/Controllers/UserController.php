<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; 


class UserController extends Controller
{
    public function register(Request $request)
    {
        //Validálás
        $validated = $request->validate([
            'nev' => 'required|string|max:255',
            //e-mail egyedi legyen a user táblában
            //e-mail formailag helyes
            'email' => 'required|email|unique:users',
            //confirmed: a jelszót meg kell erősíteni
            'password' => 'required|min:8|confirmed',
        ]);
        //user létrehozása
        $user = User::create([
            'nev' => $validated['nev'],
            'becenev' => $validated['nev'],
            'email' => $validated['email'],
            //Hash a jelszót titkosítja
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Hibás email vagy jelszó'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sikeres kijelentkezés'
        ]);
    }
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
        if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen felhasználó."]);
        }
        else
        {
            return response()->json($resp);
        }
    }
    public function show2(string $id)
    {
        $resp = User::find($id);
        if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen felhasználó."]);
        }
        else
        {
            return response()->json($resp);
        }
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
