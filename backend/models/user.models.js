const mongoose=require('mongoose');
const { Schema }=mongoose;
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const userSchema=new Schema({
        username:{
            type:String,
            unique:true,
            trim:true,
            required:true,
            index:true
        },
        email:{
            type:String,
            trim:true,
            unique:true,
            lowercase:true,
            required:true
        },
        password:{
            type:String,
            minlength:8,
            required:true,
            
        },
        refreshtoken:{
            type:String
        }
    },
    {
        timestapms:true
    }
)

userSchema.pre("save",async function(next){      //using pre ooks to bcrypt password before saving it to plane database...
    if(!this.isModified('password')){
        return next()
    }
    const salt=await bcrypt.genSalt(5)
    this.password= await bcrypt.hash(this.password,salt);
    next()

})

//custom method to compare password....
userSchema.methods.matchPassword=async function(password){
    console.log(password)
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.genrateacesstoken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
    },process.env.ACESS_JWT_SECRET,
        {
            expiresIn:process.env.ACESS_TOKEN_EXPIREY
        }
    )
}

userSchema.methods.genraterefreshtoken=function(){
    return jwt.sign({
        _id:this._id,

    },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIREY
        }
    )
}


const user=mongoose.model('User',userSchema)
module.exports=user