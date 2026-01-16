<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsoportTagsag extends Model
{
    protected $table = "csoport_tagsag";
    function user()
    {
        return $this->belongsTo(User::class,'felhasznalo_id');
    }
    function csoport()
    {
        return $this->belongsTo(Csoportok::class,'csoport_id');
    }
}
