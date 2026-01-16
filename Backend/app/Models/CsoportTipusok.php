<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsoportTipusok extends Model
{
    
    protected $table = "csoport_tipusok";
    function csoportok()
    {
        return $this->hasMany(Csoportok::class,'csoport_tipusok_id');
    }
}
