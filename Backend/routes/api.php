<?php

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
Route::post('/felhasznalo/register', action: [UserController::class, 'register']);
Route::post('/felhasznalo/login', [UserController::class, 'login']) ->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/kuponok/create', [KuponController::class, 'store']);
    Route::post('/csoport/create', [CsoportokController::class, 'store']);
    Route::post('/vevesiLista/create', [VevesListaController::class, 'store']);
    Route::post('/vevesiObjektum/create', [VevesObjektumController::class, 'store']);
    Route::post('/felhasznalo/logout', [UserController::class, 'logout']);
    Route::get("/felhasznalo",  [UserController::class, 'show2']);
    Route::get( '/felhasznalo/osszKoltesei',[VevesObjektumController::class, 'show3']);
    Route::get( '/felhasznalo/eHaviKoltesei',[VevesObjektumController::class, 'show4']);
    Route::get( '/felhasznalo/eEviKoltesei',[VevesObjektumController::class, 'show5']);
    Route::get("/felhasznalo/vevesiListak", [VevesListaController::class, 'show1']);
    Route::get("/csoport/{id}/felhasznalok", [CsoportTagsagController::class, 'show']);
    Route::get("/csoport/{id}/vevesiListak", [VevesListaController::class, 'show3']);
    Route::get("/felhasznalo/csoportjai", [UserController::class, 'show']);
});
