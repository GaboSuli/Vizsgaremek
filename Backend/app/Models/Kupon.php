<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kupon extends Model
{
    protected $table = "kupon";
    function user()
    {
        return $this->belongsTo(User::class,'feltolto_kuponos_id');
    }
}