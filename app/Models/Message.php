<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'message',
        'sender_id',
        'receiver_id',
        'group_id'
    ];
    public function sender(){
        return $this->belongsTo(User::class,'sender_id');
    }
    public function reciver(){
        return $this->belongsTo(User::class,'receiver_id');
    }
    public function attachments(){
        return $this->hasMany(MessageAttachment::class);
    }
   
}
