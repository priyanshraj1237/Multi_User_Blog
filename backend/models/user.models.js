const mongoose=require('mongoose')
const express=require('express')

const userschema=new mongoose.Schema({
    username:{type:String,trim:true,unique:true,required:true},
    email:{type:String,required:true},
    password:{type:String,minlength:6,required:true},
    createat:{type:Date,default:Date.now}
})

const user=mongoose.model('User',userschema)
module.exports=user