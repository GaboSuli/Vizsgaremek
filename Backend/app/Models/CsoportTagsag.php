<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsoportTagsag extends Model
{
    function user()
    {
        return $this->belongsTo(User::class,'felhasznalo_id');
    }
    function csoport()
    {
        return $this->belongsTo(Csoportok::class,'csoport_id');
    }
}
