<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Temak extends Model
{
    protected $table = "temak";
    function beallitasok()
    {
        return $this->hasMany(User::class,'tema_id');
    }
}
