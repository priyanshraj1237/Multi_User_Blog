const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifytoken.js');
const controllers = require('../controllers/blog.controllers.js');

// Protected routes
router.post('/create', verifyToken, controllers.createBlog);
router.get('/retrive', verifyToken, controllers.getUserBlogs);
router.get('/:id',verifyToken,controllers.getBlogbyId)
router.delete('/:id',verifyToken,controllers.deleteblog)
router.put('/:id',verifyToken,controllers.updatablog)

const search_controllers=require('../controllers/search_blog.controllers.js')
router.post('/search',verifyToken,search_controllers.search_blog)

module.exports = router;
