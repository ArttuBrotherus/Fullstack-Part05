import { useState, useEffect } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'

const BlogForm = (props) => {
  return(
    <div>
      <h1>create new</h1>
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
  const [notification, setNotif] = useState('')
  const [bFormVisible, setBlgFrmVisible] = useState(false)

  const submitBlog = () => {
    const hideWhenVisible = { display: bFormVisible ? 'none' : '' }
    const showWhenVisible = { display: bFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlgFrmVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm addBlog={addBlog} newTitle={newTitle} handleTitle={handleTitle} newAuthor={newAuthor} manageAuthor={manageAuthor} newUrl={newUrl} handleUrl={handleUrl} />
          <button onClick={() => setBlgFrmVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const Notification = ({ message }) => {

    const notifStyle = {
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px"
    }

    if (message === '') {
      return null
    }
  
    return (
      <div className='error' style={notifStyle}>
        {message}
      </div>
    )
  }

const addBlog = (event) => {
  event.preventDefault()

  pt05blogSer.create({
    "title": newTitle,
    "author": newAuthor,
    "url": newUrl,
    "likes": 0
  })

  const notifTitle = newTitle
  const notifAuthor = newAuthor

  setTitle('')
  setAuthor('')
  setUrl('')
  setBlgFrmVisible(false)

  setNotif("a new blog " + notifTitle + " by " + notifAuthor + " added")
  setTimeout(() => {
    setNotif('')
  }, 3000)

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
        setNotif("wrong username or password")
        setTimeout(() => {
          setNotif('')
        }, 3000)
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
        <Notification message={notification} />
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
        <Notification message={notification} />
        <span>{user.name} logged in</span>
        <button onClick={logOut}>logout</button>
        <p></p>
        <p></p>
        <p></p>
        {submitBlog()}
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