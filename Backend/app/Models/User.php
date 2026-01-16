<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    function kupon()
    {
        return $this->hasMany(Kupon::class,'feltolto_kuponos_id');
    }
    function vevesLista()
    {
        return $this->hasMany(VevesLista::class,'felhasznalo_id');
    }
    function csoportok()
    {
        return  $this->hasMany(Csoportok::class,'keszito_felhasznalo_id');
    }
    function csoportTagsag()
    {
        return $this->hasMany(CsoportTagsag::class,'felhasznalo_id');
    }
}
