<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategoriak extends Model
{
    use HasFactory;
    protected $table = "kategoriak";
    public $timestamps = false;
    function alkategoriak()
    {
        return $this->hasMany(Alkategoriak::class,'kategoria_id');
    }
}
