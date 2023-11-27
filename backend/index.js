require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Blog = require('./models/blog')
const { getAll, create, deleteBlog } = require('./models/blogSer')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())

app.post('/api/login', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

app.get('/api/users', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

app.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

app.get('/api/blogs', async (request, response) => {

  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

app.post('/api/blogs', async (request, response) => {

  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  const nBlog = await create({
    "title": body.title,
    "author": body.author,
    "url": body.url,
    "likes": body.likes,
    "user": user._id
  })

  user.blogs = user.blogs.concat(nBlog._id)
  await user.save()

  response.status(201).json(nBlog)

})

app.delete('/api/blogs/:id', async (request, response) => {

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

app.put('/api/blogs/:id', async (request, response) => {
  const body = request.body
  updBlg = {
    "title": body.title,
    "author": body.author,
    "url": body.url,
    "likes": body.likes
  }
  await Blog.findByIdAndUpdate(request.params.id, updBlg)
  response.json(updBlg)
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app