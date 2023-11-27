const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "Commentary on lackluster YouTube reaction channels",
    author: "K.C. Uno",
    url: "01/01",
    likes: 1
  },
  {
    title: "History of Python",
    author: "S.Y. Bidoss",
    url: "02/02",
    likes: 2
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('two blog posts in the json format', async () => {

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
  expect(() => JSON.stringify(response.body)).not.toThrow()

})

test('identifier property is id', async () => {

  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })

})

test('post request creates a new blog post', async () => {

  const newBlog = {
    "title": "Analysis on Paulie Gualtieri", 
    "author": "P.U. Kino",
    "url": "www/www",
    "likes": 33
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)

})

test('deleting a post lowers the blog amount + the ID of deleted post is not available', async () => {

  const notesAtStart = await Blog.find({})
  const idToDelete  = notesAtStart[0].id

  await api
    .delete(`/api/blogs/${idToDelete}`)
    .expect(204)

  const blogsInEnd = await Blog.find({})
  expect(blogsInEnd).toHaveLength(
    initialBlogs.length - 1
  )

  const contents = blogsInEnd.map(r => r.id)

  expect(contents).not.toContain(idToDelete)

})

test('updating changes the blog post + returns the right status code', async () => {
  const blogsAtStart = await Blog.find({})
  const oldBlog = blogsAtStart[0]
  const updId = oldBlog.id

  const updBlg = {
    "title": "Analysis on Paulie Gualtieri", 
    "author": "P.U. Kino",
    "url": "www/www",
    "likes": 33
  }

  await api
    .put(`/api/blogs/${updId}`)
    .send(updBlg)
    .expect(200)

  const freshBlog = await Blog.findById(updId)
  expect(oldBlog).not.toEqual(freshBlog)
})

afterAll(async () => {
  await mongoose.connection.close()
})