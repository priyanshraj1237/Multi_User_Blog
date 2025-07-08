const jwt=require('jsonwebtoken')
const user=require('../models/user.models.js')
// const verify=async(req,res,next)=>{
//         const token=req.header('auth')
//         console.log("tokens :",token)
// }


const verify=async(req,res,next)=>{
    const token=req.cookies.token;
    // console.log("checking token",token)
    if(!token){
        return res.status(400).json({success :false ,message :"acees denied,user invalid,no token"})
    }
    try{
        const decode=await jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decode)
        const id=decode.id    //not neede for now...

        let exsistuser=await user.findById(id)
        if(!exsistuser){
            return res.status(404).json({success:false,message:"user not found..."})
        }
        req.user=decode;
        next()

    }catch(err){
        console.error("error occured :",err)
        return res.status(400).json({sucess:false,message:"invalid token"})
    }
}

module.exports=verify