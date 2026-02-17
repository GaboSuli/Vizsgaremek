<?php

namespace App\Http\Controllers;

use App\Models\CsoportTagsag;
use App\Models\mennyisegTipusok;
use App\Models\User;
use App\Models\VevesLista;
use App\Models\VevesObjektum;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class VevesObjektumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stats = VevesObjektum::with("alKategoria")->with("vevesLista")->get();
        $statisztika = array();
        $endResult = array();
        foreach ($stats as $key => $temp) {
            if ($temp->elfogadott_statisztikara === 1)
            {
                $arrayKey = $temp->alKategoria->megnevezes.";".$temp->vevesLista->created_at->format('y-m');
                $mertekegyseg = mennyisegTipusok::find($temp->alKategoria->mennyiseg_tipus_id)->mertekegyseg;
                if (!array_key_exists($arrayKey,$statisztika))
                {
                    $statisztika[$arrayKey] = [$temp->ar,$temp->mennyiseg,$mertekegyseg];
                }
                else
                {
                    $statisztika[$arrayKey][0] += $temp->ar;
                    $statisztika[$arrayKey][1] += $temp->mennyiseg; 
                }
            }
        }
        foreach ($statisztika as $key => $item)
        {
            $tempAdatok = explode(";",$key);
            array_push($endResult, array("Alkategoria"=>$tempAdatok[0],"Datum"=>$tempAdatok[1],"KiszamoltAtlag"=>($item[0]/$item[1]),"Mertekegyseg"=>$item[2]));
        }
        return response()->json($endResult,200);
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
        $validator = Validator::make($request->all(),[
            'veves_lista_id' => 'required|exists:veves_lista,id',
            'alKategoria_id' => 'required|exists:alkategoriak,id',
            'megnevezes' => 'string',
            'ar' => 'required|numeric|min:0',
            'mennyiseg' => 'required|numeric|min:0'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        $authCheck = VevesLista::where("felhasznalo_id","=",auth()->id())::where("id","=",$request->veves_lista_id)->first();
        if (empty($authCheck))
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        else if (!empty($authCheck))
        {
            if (!empty($authCheck->csoport_id))
            {
                $authUser = CsoportTagsag::where("felhasznalo_id","=",auth()->id())::where("csoport_id","=",$authCheck->csoport_id)->first();
                if (empty($authUser))
                {
                    return response(["message"=>"Nincs jogosultságod ehhez."],403);
                }
                else
                {
                    if ($authUser->jogosultsag_szint < 1)
                    {
                        return response(["message"=>"Nincs jogosultságod ehhez."],403);
                    }
                }
            }
        }
        $newRec = new VevesObjektum();
        $newRec->veves_lista_id = $request->veves_lista_id;
        $newRec->alKategoria_id = $request->alKategoria_id;
        $newRec->megnevezes = $request->megnevezes;
        $newRec->ar = $request->ar;
        $newRec->mennyiseg = $request->mennyiseg;
        $newRec->save();
        return response()->json(['message'=>'sikeres feltöltes'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stats = VevesObjektum::where("alKategoria_id","=",$id)->with("alKategoria")->with("vevesLista")->get();
        $statisztika = array();
        $endResult = array();
        foreach ($stats as $key => $temp) {
            if ($temp->elfogadott_statisztikara === 1)
            {
                $arrayKey = $temp->alKategoria->megnevezes.";".$temp->vevesLista->created_at->format('y-m');
                $mertekegyseg = mennyisegTipusok::find($temp->alKategoria->mennyiseg_tipus_id)->mertekegyseg;
                if (!array_key_exists($arrayKey,$statisztika))
                {
                    $statisztika[$arrayKey] = [$temp->ar,$temp->mennyiseg,$mertekegyseg];
                }
                else
                {
                    $statisztika[$arrayKey][0] += $temp->ar;
                    $statisztika[$arrayKey][1] += $temp->mennyiseg; 
                }
            }
        }
        foreach ($statisztika as $key => $item)
        {
            $tempAdatok = explode(";",$key);
            array_push($endResult, array("Alkategoria"=>$tempAdatok[0],"Datum"=>$tempAdatok[1],"KiszamoltAtlag"=>($item[0]/$item[1]),"Mertekegyseg"=>$item[2]));
        }
        return response()->json($endResult,200);
    }
public function show2(int $ev)
    {
        $stats = VevesObjektum::with("alKategoria")->with("vevesLista")->get();
        $statisztika = array();
        $endResult = array();
        $keresettEv = 0;
        if ($ev > 2000)
        {
            $keresettEv = $ev;
        }
        elseif ($ev <= 100 and $ev >= 0)
        {
            $keresettEv = $ev+2000;
        }
        else
        {
            return response()->json(["Hiba"=>"Hibás év megadás. Vagy 1-100-ig, vagy 2000 fölötti számot adj meg."],400);
        }
        foreach ($stats as $key => $temp) {
            if ($temp->elfogadott_statisztikara === 1 and intval($temp->vevesLista->created_at->format('Y')) === $keresettEv)
            {
                $arrayKey = $temp->alKategoria->megnevezes.";".$temp->vevesLista->created_at->format('Y');
                $mertekegyseg = mennyisegTipusok::find($temp->alKategoria->mennyiseg_tipus_id)->mertekegyseg;
                if (!array_key_exists($arrayKey,$statisztika))
                {
                    $statisztika[$arrayKey] = [$temp->ar,$temp->mennyiseg,$mertekegyseg];
                }
                else
                {
                    $statisztika[$arrayKey][0] += $temp->ar;
                    $statisztika[$arrayKey][1] += $temp->mennyiseg; 
                }
            }
        }
        foreach ($statisztika as $key => $item)
        {
            $tempAdatok = explode(";",$key);
            array_push($endResult, array("Alkategoria"=>$tempAdatok[0],"Datum"=>$tempAdatok[1],"KiszamoltAtlag"=>($item[0]/$item[1]),"Mertekegyseg"=>$item[2]));
        }
        return response()->json($endResult,200);
    }
    public function show3(User $user)
    {
        $data = DB::table("veves_objekt")
        ->join("alkategoriak","veves_objekt.alKategoria_id","=","alkategoriak.id")
        ->join("veves_lista","veves_objekt.veves_lista_id","=","veves_lista.id")
        ->selectRaw("alkategoriak.megnevezes, SUM(veves_objekt.ar) as 'Osszegzett' ")
        ->where("elfogadott_statisztikara","=",1)
        ->where("veves_lista.felhasznalo_id","=", auth()->id())
        ->groupBy("alkategoriak.megnevezes")
        ->get();
        return response()->json($data);
    }
    public function show4(User $user)
    {
        $data = DB::table("veves_objekt")
        ->join("alkategoriak","veves_objekt.alKategoria_id","=","alkategoriak.id")
        ->join("veves_lista","veves_objekt.veves_lista_id","=","veves_lista.id")
        ->selectRaw("alkategoriak.megnevezes, SUM(veves_objekt.ar) as 'Osszegzett' ")
        ->where("elfogadott_statisztikara","=",1)
        ->where("veves_lista.felhasznalo_id","=", auth()->id())
        ->whereRaw("month(veves_lista.created_at) = " . date("m"))
        ->whereRaw("year(veves_lista.created_at) = " . date("Y"))
        ->groupBy("alkategoriak.megnevezes")
        ->get();
        return response()->json($data);
    }
    
    public function show5(User $user)
    {
        $data = DB::table("veves_objekt")
        ->join("alkategoriak","veves_objekt.alKategoria_id","=","alkategoriak.id")
        ->join("veves_lista","veves_objekt.veves_lista_id","=","veves_lista.id")
        ->selectRaw("alkategoriak.megnevezes, SUM(veves_objekt.ar) as 'Osszegzett' ")
        ->where("elfogadott_statisztikara","=",1)
        ->where("veves_lista.felhasznalo_id","=", auth()->id())
        ->whereRaw("year(veves_lista.created_at) = " . date("Y"))
        ->groupBy("alkategoriak.megnevezes")
        ->get();
        return response()->json($data);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VevesObjektum $vevesObjektum)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, string $objektId)
    {
        $objekt = VevesObjektum::find($objektId);
        $authUser = auth()->user();
        $authentication = VevesLista::find($objekt->veves_lista_id);
        if (!empty($authentication->csoport_id) or $authUser->jogosultsag_szint < 2)
        {
            $authUser2 = CsoportTagsag::where("felhasznalo_id","=",auth()->id())::where("csoport_id","=",$authentication->csoport_id)->first();
                if (empty($authUser2))
                {
                    return response(["message"=>"Nincs jogosultságod ehhez."],403);
                }
                else
                {
                    if ($authUser2->jogosultsag_szint < 1)
                    {
                        return response(["message"=>"Nincs jogosultságod ehhez."],403);
                    }
                }
        }
        else if ($authentication->felhasznalo_id != auth()->id())
        {
            return response(["message"=>"Nincs jogosultságod ehhez."],403);
        }
        $validator = Validator::make($request->all(),
        [
            'alKategoria_id' => 'exists:user,id',
            'megnevezes' => 'string',
            'ar' => 'integer|min:0',
            'mennyiseg' => 'float|min:0',
            'elfogadott_statisztikara' => 'boolean'
        ]);
        if ($validator->fails())
        {
            return response()->json(['success'=>false,'errors'=>$validator->errors()->toArray()],422);
        }
        if (!$objekt->elfogadott_statisztikara or $authUser->user()->jogosultsag_szint >= 2)
        {
            if (!empty($request->alKategoria_id))
            {
                $objekt->alKategoria_id = $request->alKategoria_id;
            }
            if (!empty($request->ar))
            {
                $objekt->ar = $request->ar;
            }
            if (!empty($request->mennyiseg))
            {
                $objekt->mennyiseg = $request->mennyiseg;
            }
        }
        if (!empty($request->elfogadott_statisztikara))
        {
            if ($authUser->user()->jogosultsag_szint >= 2)
            {
                $objekt->elfogadott_statisztikara = $request->elfogadott_statisztikara;
            }
        }
        if (!empty($request->megnevezes))
        {
            $objekt->megnevezes = $request->megnevezes;
        }
        $objekt->save();
        return response(["Message"=>"Sikeres változtatás."],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VevesObjektum $vevesObjektum)
    {
        //
    }
}
