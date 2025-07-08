const express=require('express')
const app=express()

require('dotenv').config()
const port=process.env.PORT || 5000

//connection to mongodb adress....
const connectiondb=require('./config/conndb.js')
connectiondb()

//parsing json..........................
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


//cookiesparser...
const cookiesparser=require('cookie-parser')
app.use(cookiesparser())

//routing connecton......................
const router=require('./routers/all_url.js')
app.use('/',router)





app.listen(port,()=>{
    console.log(`port is running on server ${port}`)
})
