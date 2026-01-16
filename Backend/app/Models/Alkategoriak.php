<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alkategoriak extends Model
{
    protected $table = "alkategoriak";
    function kategoriak()
    {
        return $this->belongsTo(Kategoriak::class,'kategoria_id');
    }
    function mennyisegtipus()
    {
        return $this->belongsTo(mennyisegTipusok::class,'mennyiseg_tipus_id');
    }
    
    function vevesobjektum()
    {
        return $this->hasMany(VevesObjektum::class,'alkategoria_id');
    }
}
