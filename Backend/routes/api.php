<?php

use App\Http\Controllers\CsoportokController;
use App\Http\Controllers\KuponController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VevesListaController;
use App\Http\Controllers\VevesObjektumController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get( '/statisztika/all',[VevesObjektumController::class, 'index']);
Route::get( '/statisztika/id/{id}',[VevesObjektumController::class, 'show']);
Route::get( '/statisztika/ev/{ev}',[VevesObjektumController::class, 'show2']);
Route::get('/kuponok/get',[KuponController::class, 'index']);

Route::post('/kuponok/create', [KuponController::class, 'store']);
Route::post('/csoport/create', [CsoportokController::class, 'store']);
Route::post('/vevesiLista/create', [VevesListaController::class, 'store']);
Route::post('/vevesiObjektum/create', [VevesObjektumController::class, 'store']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/felhasznalo/register', action: [UserController::class, 'register']);
Route::post('/felhasznalo/login', [UserController::class, 'login']) ->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/felhasznalo/logout', [UserController::class, 'logout']);
    Route::get("/felhasznalo",  [UserController::class, 'show2']);
    Route::get( '/felhasznalo/osszKoltesei',[VevesObjektumController::class, 'show3']); // a felhasználo csak sajátját hivhassa
    Route::get( '/felhasznalo/eHaviKoltesei',[VevesObjektumController::class, 'show4']); // a felhasználo csak sajátját hivhassa
    Route::get( '/felhasznalo/eEviKoltesei',[VevesObjektumController::class, 'show5']); // a felhasználo csak sajátját hivhassa
    Route::get("/felhasznalo/vevesiListak", [VevesListaController::class, 'show1']); // a felhasználo csak sajátját hivhassa
    Route::get("/vevesiLista", [VevesListaController::class, 'show2']); // a felhasználo csak sajátját hivhassa
    Route::get("/csoport/{id}/vevesiListak", [VevesListaController::class, 'show3']); // a felhasználo csak azokat hivhassa amilyen csoportba van
    Route::get("/felhasznalo/csoportjai", [UserController::class, 'show']); // a felhasználo csak sajátját hivhassa
});
