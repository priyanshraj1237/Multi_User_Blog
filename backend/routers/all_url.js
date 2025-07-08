const express = require('express');
const routers = express.Router();


//just for testing....
routers.get('/', (req, res) => {
    res.send("You are in all_url.js");
});


const user_routes=require('./user.routers.js')
routers.use('/api/user',user_routes)

const blog_routes=require('./blog.routers.js')
routers.use('/api/blog',blog_routes)

module.exports = routers;
