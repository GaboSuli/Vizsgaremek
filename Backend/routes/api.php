<?php

use App\Http\Controllers\AlkategoriakController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CsoportMeghivasController;
use App\Http\Controllers\CsoportokController;
use App\Http\Controllers\CsoportTagsagController;
use App\Http\Controllers\KuponController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VevesListaController;
use App\Http\Controllers\VevesObjektumController;
use Illuminate\Support\Facades\Route;

Route::get('/legtobbetVett',[VevesObjektumController::class,'legtobbetVett']);
Route::get( '/felhasznaloMennyiseg',[UserController::class, 'amountOfUsers']);
Route::get( '/alkategoriak',[AlkategoriakController::class, 'index']);
Route::get( '/statisztika/all',[VevesObjektumController::class, 'index']);
Route::get( '/statisztika/id/{id}',[VevesObjektumController::class, 'show']);
Route::get( '/statisztika/ev/{ev}',[VevesObjektumController::class, 'show2']);
Route::get('/kuponok/get',[KuponController::class, 'index']);
Route::post('/felhasznalo/register', [UserController::class, 'register']);
Route::post('/felhasznalo/login', [UserController::class, 'login']) ->name('login');
Route::post('/contact/create', [ContactController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/kuponok/create', [KuponController::class, 'store']);
    Route::delete('/kuponok/torles/{id}',[KuponController::class, 'destroy']);
    Route::put('/kuponok/modositas/{id}',[KuponController::class, 'update']);

    Route::post('/contact/create', [ContactController::class, 'store']);
    Route::get('/contact', [ContactController::class, 'index']);
    Route::delete('/contact/torles/{id}',[ContactController::class, 'destroy']);

    Route::delete('/vevesiObjektum/torles/{id}',[VevesObjektumController::class, 'destroy']);
    Route::post('/vevesiObjektum/create', [VevesObjektumController::class, 'store']);
    Route::put('/vevesiObjektum/modositas/{objektumId}',[VevesObjektumController::class, 'update']);

    Route::delete('/vevesiLista/torles/{id}',[VevesListaController::class, 'destroy']);
    Route::post('/vevesiLista/create', [VevesListaController::class, 'store']);
    
    Route::put('/csoport/modositas/{csoportId}',[CsoportokController::class, 'update']);
    Route::put('/csoportTagsag/modositas/{csoportId}',[CsoportTagsagController::class, 'update']);
    Route::post('/csoport/create', [CsoportokController::class, 'store']);
    Route::get('/csoport/{id}/felhasznalok', [CsoportTagsagController::class, 'show']);
    Route::get('/csoport/{id}/vevesiListak', [VevesListaController::class, 'show3']);
    Route::delete('/csoport/torles/{id}',[CsoportokController::class, 'destroy']);
    Route::delete('/csoportTagsag/torles/{id}',[CsoportTagsagController::class, 'destroy']);

    Route::post("/csoportMeghivas/meghivas",[CsoportMeghivasController::class,'store']);
    Route::put("/csoportMeghivas/decision/{csoport_id}",[CsoportMeghivasController::class,'decide']);
    Route::get("/csoportMeghivas/all",[CsoportMeghivasController::class,'index']);

    Route::get("/felhasznalo",  [UserController::class, 'show2']);
    Route::get( '/felhasznalo/osszKoltesei',[VevesObjektumController::class, 'show3']);
    Route::get( '/felhasznalo/eHaviKoltesei',[VevesObjektumController::class, 'show4']);
    Route::get( '/felhasznalo/eEviKoltesei',[VevesObjektumController::class, 'show5']);
    Route::get('/felhasznalo/vevesiListak', [VevesListaController::class, 'show1']);
    Route::get('/felhasznalo/csoportjai', [UserController::class, 'show']);
    Route::post('/felhasznalo/logout', [UserController::class, 'logout']);
    Route::delete('/felhasznalo/torles/{id}',[UserController::class, 'destroy']);
    Route::put('/felhasznalo/modositas',[UserController::class, 'update']);

    Route::get('/vevesilistak/admin', [VevesListaController::class, 'showAdmin']);
    Route::get('/csoportok/admin', [CsoportTagsagController::class, 'showAdmin']);
    Route::get('/felhasznalo/admin', [UserController::class, 'showAdmin']);
});
