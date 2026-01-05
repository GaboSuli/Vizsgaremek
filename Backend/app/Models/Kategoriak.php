<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategoriak extends Model
{
    function alkategoriak()
    {
        return $this->hasMany(Alkategoriak::class,'kategoria_id');
    }
}
