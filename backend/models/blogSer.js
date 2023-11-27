
const Blog = require('./blog')

const getAll = () => {
  return Blog.find({})
}

const create = newObject => {

    const newBlog = new Blog(newObject) 

    return newBlog.save()
}

const actions = {
  getAll: getAll, 
  create: create
}

module.exports = actions;