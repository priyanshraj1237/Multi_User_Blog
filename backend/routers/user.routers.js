const express=require('express')
const routers=express.Router()
const controllers=require('../controllers/user.controllers.js')
const verifytoken=require('../middlewares/verifytoken.js')

//@api
//purpose:user_registration
routers.post('/register',controllers.register)
routers.post('/login',controllers.login)
routers.get('/demo',verifytoken ,controllers.demo)

module.exports=routers
