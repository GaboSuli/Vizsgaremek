<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Temak extends Model
{
    function beallitasok()
    {
        return $this->hasMany(Beallitasok::class,'tema_id');
    }
}
