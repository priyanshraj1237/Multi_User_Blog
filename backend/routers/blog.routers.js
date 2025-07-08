const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifytoken.js');
const controllers = require('../controllers/blog.controllers.js');

// Protected routes
router.post('/create', verifyToken, controllers.createBlog);
router.get('/retrive', verifyToken, controllers.getUserBlogs);
router.get('/:id',verifyToken,controllers.getBlogbyId)
router.delete('/json/:id',verifyToken,controllers.deleteblog)
router.put('/update/:id',verifyToken,controllers.updatablog)

module.exports = router;
