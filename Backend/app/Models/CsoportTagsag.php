<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsoportTagsag extends Model
{
    use HasFactory;
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
