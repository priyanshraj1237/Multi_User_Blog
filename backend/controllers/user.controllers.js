const express=require('express')
const bcrypt=require('bcryptjs')
const User=require('../models/user.models.js');
const user = require('../models/user.models.js');
const jwt=require('jsonwebtoken')


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if any field is missing
    if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
      return res.status(400).json({ success: false, message: "All fields are required and cannot be blank." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username or Email already registered." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully.",user:newUser });

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
        res.status(500).json({sucess:false, message: "enter all CredentialsContainer..."})
      }
      const exsistuser= await user.findOne({email})

      if(!exsistuser) {
          return res.status(404).json({sucess:'false',message:"user doen not exsist.."})
      }
      //comparing password..

      const ismatch=await bcrypt.compare(password,exsistuser.password)
      if(!ismatch){
        return res.status(401).json({sucess:false,message:"password is not correct"})
      }
      //creating jsonwebtoken...
      const token=jwt.sign(
        {
          id:exsistuser._id,
          email:exsistuser.email,
        },
          process.env.JWT_SECRET,{ expiresIn: '7d' }
        
      )
        // Set token in HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ensures cookie sent over HTTPS
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
        });

      // Send success response
      res.status(200).json({ success: true,token, message: "Login successful" });
    
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

const demo=(req,res)=>{
  res.json({ message: "This is a protected profile page", user: req.user });
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