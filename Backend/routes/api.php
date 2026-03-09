<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\CsoportokController;
use App\Http\Controllers\CsoportTagsagController;
use App\Http\Controllers\KuponController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VevesListaController;
use App\Http\Controllers\VevesObjektumController;
use Illuminate\Support\Facades\Route;

Route::get( '/statisztika/all',[VevesObjektumController::class, 'index']);
Route::get( '/statisztika/id/{id}',[VevesObjektumController::class, 'show']);
Route::get( '/statisztika/ev/{ev}',[VevesObjektumController::class, 'show2']);
Route::get('/kuponok/get',[KuponController::class, 'index']);
Route::post('/felhasznalo/register', [UserController::class, 'register']);
Route::post('/felhasznalo/login', [UserController::class, 'login']) ->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/vevesiObjektum/torles/{id}',[VevesObjektumController::class, 'destroy']);
    Route::delete('/vevesiLista/torles/{id}',[VevesListaController::class, 'destroy']);
    Route::delete('/csoport/torles/{id}',[CsoportokController::class, 'destroy']);
    Route::delete('/csoportTagsag/torles/{id}',[CsoportTagsagController::class, 'destroy']);
    Route::delete('/kuponok/torles/{id}',[KuponController::class, 'destroy']);
    Route::delete('/felhasznalo/torles/{id}',[UserController::class, 'destroy']);
    Route::put('/kuponok/modositas/{id}',[KuponController::class, 'update']);
    Route::put('/felhasznalo/modositas',[UserController::class, 'update']);
    Route::put('/csoport/modositas/{csoportId}',[CsoportokController::class, 'update']);
    Route::put('/csoportTagsag/modositas/{csoportId}',[CsoportTagsagController::class, 'update']);
    Route::put('/vevesiObjektum/modositas/{objektumId}',[VevesObjektumController::class, 'update']);
    Route::post('/contact/create', [ContactController::class, 'store']);
    Route::post('/kuponok/create', [KuponController::class, 'store']);
    Route::post('/csoport/create', [CsoportokController::class, 'store']);
    Route::post('/csoportTagsag/create', [CsoportTagsagController::class, 'store']);
    Route::post('/vevesiLista/create', [VevesListaController::class, 'store']);
    Route::post('/vevesiObjektum/create', [VevesObjektumController::class, 'store']);
    Route::post('/felhasznalo/logout', [UserController::class, 'logout']);
    Route::get('/contact', [ContactController::class, 'index']);
    Route::get("/felhasznalo",  [UserController::class, 'show2']);
    Route::get( '/felhasznalo/osszKoltesei',[VevesObjektumController::class, 'show3']);
    Route::get( '/felhasznalo/eHaviKoltesei',[VevesObjektumController::class, 'show4']);
    Route::get( '/felhasznalo/eEviKoltesei',[VevesObjektumController::class, 'show5']);
    Route::get('/felhasznalo/vevesiListak', [VevesListaController::class, 'show1']);
    Route::get('/csoport/{id}/felhasznalok', [CsoportTagsagController::class, 'show']);
    Route::get('/csoport/{id}/vevesiListak', [VevesListaController::class, 'show3']);
    Route::get('/felhasznalo/csoportjai', [UserController::class, 'show']);
});
