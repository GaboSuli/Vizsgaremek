<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategoriak extends Model
{
    protected $table = "kategoriak";
    function alkategoriak()
    {
        return $this->hasMany(Alkategoriak::class,'kategoria_id');
    }
}
