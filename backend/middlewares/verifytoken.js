const jwt=require('jsonwebtoken')
const User=require('../models/user.models.js')
// const verify=async(req,res,next)=>{
//         const token=req.header('auth')
//         console.log("tokens :",token)
// }

const verify=async(req,res,next)=>{
    const token=req.cookies?.acesstoken || req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
        return res.status(400).json({success :false ,message :"acees denied,user invalid,no token"})
    }
    // console.log("token :",token,".............................................................")
    try{
        // console.log(token)

        const decode=jwt.verify(token,process.env.ACESS_JWT_SECRET)
        // console.log(decode)

        const user=await User.findById(decode?._id).select("-password -refreshtoken")
        console.log("user:" ,user)

        if(!user){
            return res.status(404).json({success:false,message:"user not found..."})
        }
        req.user=user;
        next()
    }catch(err){
        console.error("error occured :",err)
        return res.status(400).json({sucess:false,message:"invalid token"})
    }
}

module.exports=verify






        // const id=decode.id  
        // console.log(id)
        // let exsistuseri=await user.findById(id) 
        // if(!exsistuser){
        //     return res.status(404).json({success:false,message:"user not found..."})
        // }
        // req.user=decode;
        // console.log(req.user)