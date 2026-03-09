<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = "contact";
    function contactTipusok()
    {
        return $this->belongsTo(ContactTipusok::class,'contactTipusId');
    }
}
