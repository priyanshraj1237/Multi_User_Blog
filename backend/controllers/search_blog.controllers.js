const express=require('express')
const mongoose=require('mongoose')
const User=require('../models/user.models.js')
const Blog=require('../models/blog.models.js')

//writing searching function for blog by user_name..

const search_blog=async(req,res)=>{
    try{
        const { username }= req.body
        const is_user=await User.findOne({ username: username })
        console.log("is_user:",is_user)

        if(!is_user){
            return res.status(404).json({
                success:false,
                message:`there is no such user with username "${username}" .enter the correct username...`,

            })
        }
        const user_blog = await Blog.find({ user: is_user._id }).populate('user', 'username email');
        if (!user_blog || user_blog.length === 0) {
            return res.status(404).json({
                success:false,
                message: `${username} has not created any blog.`
            })
        }
        return res.status(200).json({
            success:true,
            blog:user_blog,
        })
    }catch(err){
         console.error(err);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
    }
    
    
}

module.exports={
    search_blog
}