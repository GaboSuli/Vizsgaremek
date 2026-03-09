<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactTipusok extends Model
{
    protected $table = "contact_tipusok";
    public $timestamps = false;
    function contact()
    {
        return $this->hasMany(Contact::class,'contactTipusId');
    }
}
