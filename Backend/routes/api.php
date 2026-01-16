<?php

use App\Http\Controllers\VevesListaController;
use App\Models\VevesLista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/felhasznalo/{id}/vevesiListak", [VevesListaController::class, 'show1']);

Route::get("/vevesiListak/{id}", [VevesListaController::class, 'show2']);