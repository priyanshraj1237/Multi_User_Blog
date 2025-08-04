const express=require('express')
const bcrypt=require('bcryptjs')
const User=require('../models/user.models.js');
const jwt=require('jsonwebtoken')
const asynchandler=require('express-async-handler');



const generateAcessandRefreshToken=async(userId)=>{
    try{
      const schemauser=await User.findById(userId)
      const acesstoken= schemauser.genrateacesstoken()
      const refreshtoken=schemauser.genraterefreshtoken()

      schemauser.refreshtoken=refreshtoken
      await schemauser.save({validateBeforeSave :false})
      return { acesstoken ,refreshtoken }
    }catch(err){
        console.log("error",err)
        console.error("error in generating refreshtokan and acesstoken...")
    }
}
const register = async (req, res) => {
  
    const { username, email, password } = req.body;
    try {
      // Check if any field is missing
    if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
      return res.status(400).json({ success: false, message: "All fields are required and cannot be blank." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username or Email already registered." });
    }
    // creating new document for the database:User
    const newuser=await User.create({
      username:username.toLowerCase(),
      email,
      password
    })
    
    const createuser=await User.findById(newuser._id).select("-password -refreshtoken")

    res.status(201).json({ success: true, createuser, message: "User registered successfully.",user:newuser});

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//user login function...useing jwt.....

const login=async(req,res)=>{
  const {email,password}=req.body;
    try{
      if(!email || !password || email.trim()==="" || password.trim()===""){
        return res.status(500).json({
          sucess:false, 
          message: "enter all CredentialsContainer..."
        })
      }

      const exsistuser= await User.findOne({email})

      if(!exsistuser) {
          return res.status(404).json({
            sucess:'false',
            message:"user doen not exsist.."})
      }
      //comparing password..

      const ismatch=await exsistuser.matchPassword(password)
      if(!ismatch){
        return res.status(401).json({
          sucess:false,
          message:"password is not correct"
        })
      }

      //creating jsonwebtoken...
      const { acesstoken ,refreshtoken }=await generateAcessandRefreshToken(exsistuser._id)

      const loggedInUser = await User.findById(exsistuser._id).select("-password -refreshToken")
      const options = {
        httpOnly: true,
        secure: true
    }

        // Set token in HTTP-only cookie
      return res
      .status(200)
      .cookie("accessToken", acesstoken, options)
      .cookie("refreshToken", refreshtoken, options)
      .json({
        success: true,
        user: loggedInUser,
        acesstoken,
        refreshtoken,
        message: "User logged in successfully"
      });

     
    
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ 
        success: false,
         message: "Server error" 
        });
    }
  };

const demo=(req,res)=>{
  res.json({ message: "This is a protected profile page","user_detail":req.user._id});     //req.user
}

const logout=async(req,res)=>{
  res.clearCookie("token",{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV=== "production"
  })
  return res.status(200).json({
    sucess:true,
    message:"Logged out Successfully..."
  })

 
}






module.exports={
    register,
    login,
    demo,
    logout
}