import { useState, useEffect } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'

const BlogForm = (props) => {
  return(
    <div>
      <form onSubmit={props.addBlog}>
        <div>
          title: <input
            value={props.newTitle}
            onChange={props.handleTitle}
          />
        </div>
        <div>
          author: <input
            value={props.newAuthor}
            onChange={props.manageAuthor}
          />
        </div>
        <div>
          url: <input
            value={props.newUrl}
            onChange={props.handleUrl}
          />
        </div>
        <div>
            <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

const addBlog = (event) => {
  event.preventDefault()

  pt05blogSer.create({
    "title": newTitle,
    "author": newAuthor,
    "url": newUrl,
    "likes": 0
  })

  setTitle('')
  setAuthor('')
  setUrl('')
}

const handleTitle = (event) => {
  setTitle(event.target.value)
}

const manageAuthor = (event) => {
  setAuthor(event.target.value)
}

const handleUrl = (event) => {
  setUrl(event.target.value)
}

  function logOut () {
    window.localStorage.clear()
    document.location.reload()
  }

  const dataOfLogged = async () => {
    setBlogs(await pt05blogSer.getAll())
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      pt05blogSer.setToken(user.token)
      dataOfLogged()
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      //important: note that the term's 'loggedUser' and not something else
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      ) 

      pt05blogSer.setToken(user.token)
      setUser(user)
      setBlogs(await pt05blogSer.getAll())
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("A login error has occurred!")
    }
  }

  function getBlogData(blog){
    return <div>{blog.title + " " + blog.author}</div>
  }

  function blogData(theBlogs){
    return theBlogs.map(getBlogData)
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log into application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const blogView = () => {
    return (
      <div>
        <h1>blogs</h1>
        <span>{user.name} logged in</span>
        <button onClick={logOut}>logout</button>
        <p></p>
        <p></p>
        <p></p>
        <h1>create new</h1>
        <BlogForm addBlog={addBlog} newTitle={newTitle} handleTitle={handleTitle} newAuthor={newAuthor} manageAuthor={manageAuthor} newUrl={newUrl} handleUrl={handleUrl} />
        {blogData(blogs)}
      </div>
    )
  }

  return (
    <div>
      {user === null ? loginForm() : blogView()}
    </div>
  )  
}

export default App