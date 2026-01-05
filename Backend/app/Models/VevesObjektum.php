<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VevesObjektum extends Model
{
    function alKategoria()
    {
        return $this->belongsTo(Alkategoriak::class,'alkategoria_id');
    }
    function vevesLista()
    {
        return $this->belongsTo(VevesLista::class,'veves_lista_id');
    }
}
