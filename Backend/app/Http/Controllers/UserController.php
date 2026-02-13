<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator; 


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
        $user->tokens()->delete();
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
    public function show(Request $request)
    {
        $resp = User::where("id",'=',auth()->id())->with("csoportok")->get();
        if (empty($resp))
        {
            return response()->json(['message'=>"Nincs ilyen felhasználó."]);
        }
        else
        {
            return response()->json($resp);
        }
    }
    public function show2(Request $request)
    {
        return response()->json($request->user());
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
    public function update(Request $request, User $csoportok, string $id)
    {
        $authUser = auth();
        if ($authUser->user()->jogosultsag_szint < 2 or $authUser->id() != $id)
        {
            return response(["Message"=>"Nincs jogosultságod ehhez."],403);
        }
        $validator = Validator::make($request->all(),
        [
            'felhasznalo_id_valtoztatni' => 'exists:users,id',
            'nev' => 'string',
            'becenev' => 'string',
            'profilkep_url' => 'string',
            'kuponok' => 'numeric|min:0|max:1',
            'termekArKovetes' => 'numeric|min:0|max:1',
            'brokerArKovetes' => 'numeric|min:0|max:1',
            'jogosultsag_szint' => 'numeric|min:0'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $user = $authUser->user();
        if ($authUser->user()->jogosultsag_szint >= 2 and !empty($request->felhasznalo_id_valtoztatni))
        {
            $user = User::find($request->felhasznalo_id_valtoztatni)->get();
        }
        if (!empty($request->nev))
        {
            $user->nev = $request->nev;
        }
        if (!empty($request->becenev))
        {
            $user->becenev = $request->becenev;
        }
        if (!empty($request->profilkep_url))
        {
            $user->profilkep_url = $request->profilkep_url;
        }
        if (!empty($request->kuponok))
        {
            $user->kuponok = $request->kuponok;
        }
        if (!empty($request->termekArKovetes))
        {
            $user->termekArKovetes = $request->termekArKovetes;
        }
        if (!empty($request->brokerArKovetes))
        {
            $user->brokerArKovetes = $request->brokerArKovetes;
        }
        if (!empty($request->jogosultsag_szint) and $authUser->user()->jogosultsag_szint >= 2)
        {
            $user->jogosultsag_szint = $request->jogosultsag_szint;
        }
        $user->save();
        return response(["Message"=>"Sikeres változtatás."],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $csoportok)
    {
        //
    }
}
