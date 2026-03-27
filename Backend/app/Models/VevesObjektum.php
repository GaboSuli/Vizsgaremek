<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VevesObjektum extends Model
{
    use HasFactory;
    protected $table = "veves_objekt";
    function alKategoria()
    {
        return $this->belongsTo(Alkategoriak::class,'alKategoria_id');
    }
    function vevesLista()
    {
        return $this->belongsTo(VevesLista::class,'veves_lista_id');
    }
}
