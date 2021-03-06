const blogsRouter = require('express').Router()
const jwt = require("jsonwebtoken")
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({})
      .populate("user", { username: 1, name: 1})

    response.json(blogs.map((u) => u.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    if (blog.likes === undefined) {
      blog.likes = 0
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({error: "token missing or invalid"})
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    try { 
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog.toJSON())
    } catch(exception) {
      next(exception)
    }
  })

  blogsRouter.delete("/:id", async (request, response, next) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const deleterId = decodedToken.id
    const blogToDelete = await Blog.findById(request.params.id)

    const deleteAllowed = deleterId.toString() === blogToDelete.user._id.toString() 

    if (!request.token || !decodedToken.id || !deleteAllowed) {
      return response.status(401).json({error: "token missing or invalid"})
    }

    try {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch (exception) {
      next(exception)
    }
  })

  blogsRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    try {
      const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }
  })

module.exports = blogsRouter