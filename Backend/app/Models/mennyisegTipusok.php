<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class mennyisegTipusok extends Model
{
    function alkategoriak()
    {
        return $this->hasMany(Alkategoriak::class,'mennyiseg_tipus_id');
    }
}
