<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function foundItem()
    {
        return $this->belongsTo(FoundItem::class);
    }
}
