<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alkategoriak extends Model
{
    use HasFactory;
    protected $table = "alkategoriak";
    public $timestamps = false;
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
        return $this->hasMany(VevesObjektum::class,'alKategoria_id');
    }
}
