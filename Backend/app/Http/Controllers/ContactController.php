<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        if ($user->jogosultsag_szint < 2)
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $contacts = Contact::with('contactTipusok')->get();
        return response($contacts,200);
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
    public function store(Request $request, User $user)
    {
        $authUser = auth()->user();
        $validator = Validator::make($request->all(),
        [
            'nev' => 'required|string|min:1',
            'email' => 'required|email',
            'contactTipusId' => 'required|exists:contact_tipusok,id',
            'text' => 'required|string|min:1'
        ]);
        if ($validator->fails())
        {
            return response(["validacios_hibak"=>$validator->errors()->toArray()],400);
        }
        $newRec = new Contact();
        $newRec->nev = $user->nev;
        $newRec->email = $user->email;
        $newRec->contactTipusId = $request->contactTipusId;
        $newRec->text = $request->text;
        $newRec->save();
        return response(["message"=>"Ürlap kitöltve"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = auth()->user();
        if ($user->jogosultsag_szint < 2)
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $toDelete = Contact::find($id);
        if (empty($toDelete))
        {
            return response(["message"=>"Nem talált ilyen."],404);
        }
        $toDelete->delete();
        return response(["message"=>"Sikeresen törölve."],200);
    }
}
