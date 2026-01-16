<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\VevesListaController;
use App\Models\VevesLista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/felhasznalo/{id}/vevesiListak", [VevesListaController::class, 'show1']);
Route::get("/vevesiLista/{id}", [VevesListaController::class, 'show2']);
Route::get("/csoport/{id}/vevesiListak", [VevesListaController::class, 'show3']);
Route::get("/felhasznalo/{id}/csoportjai", [UserController::class, 'show']);