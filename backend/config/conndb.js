const mongoose=require('mongoose')
const connection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            dbname:'NodeJs_Mastery_Course',
        })
        console.log("MongoDB connection is established...")
        
    }catch(err){
        console.error('Db connection error',err.message)
        process.exit(1)
    }
}

module.exports=connection