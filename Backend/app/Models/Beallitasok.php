<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beallitasok extends Model
{
    function tema()
    {
        return $this->belongsTo(Temak::class,'tema_id');
    }
    function user()
    {
        return  $this->belongsTo(User::class,'beallitasok_id');
    }
}
