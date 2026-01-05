<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VevesLista extends Model
{
    function user()
    {
        return $this->belongsTo(User::class,'felhasznalo_id');
    }
    function csoport()
    {
        return $this->belongsTo(Csoportok::class,'csoport_id');
    }
    function vevesobjektum()
    {
        return $this->hasMany(VevesObjektum::class,'veves_lista_id');
    }
}
