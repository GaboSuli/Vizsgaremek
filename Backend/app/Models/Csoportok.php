<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Csoportok extends Model
{
    function csoportTipus()
    {
        return $this->belongsTo(CsoportTipusok::class,'csoport_tipus_id');
    }
    function vevesLista()
    {
        return $this->hasMany(VevesLista::class,'csoport_id');
    }
    function csoportTagsag()
    {
        return $this->hasMany(Csoportok::class,'csoport_id');
    }
    function user()
    {
        return $this->belongsTo(User::class,'keszito_felhasznalo_id');
    }
}
