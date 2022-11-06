const express = require('express')
const passport = require('passport');
const BlogController = require('../controllers/blogController');

const blogRouter = express.Router();
const authenticate = passport.authenticate('jwt', { session: false  });

blogRouter.get('/own', authenticate, BlogController.getAuthorBlogs)

blogRouter.post('/', authenticate, BlogController.createBlog)

blogRouter.get('/:blogId', BlogController.getBlog)

blogRouter.get('/', BlogController.getBlogs)



blogRouter.patch('/:id', authenticate, BlogController.updateBlog)

blogRouter.patch('/:id/state', authenticate, BlogController.updateBlogState)

blogRouter.delete('/:id', authenticate, BlogController.deleteBlog)


module.exports = blogRouter;