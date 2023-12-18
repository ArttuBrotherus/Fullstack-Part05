import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'
import Togglable from './components/togglable'
import BlogForm from './components/blogViewSepa'

const App = () => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotif] = useState('')

  const appRef = useRef()

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

  function logOut () {
    window.localStorage.clear()
    document.location.reload()
  }

  const eachButton = (blog) => {
    return {
      visible: false,
      full: blog
    }
  }

  const dataOfLogged = async () => {
    const serverBlogs = await pt05blogSer.getAll()
    const blogButtons = await serverBlogs.map(eachButton)
    const sortedBlogs = blogButtons.sort((a, b) => a.full.likes - b.full.likes)
    setBlogs(sortedBlogs)
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
      dataOfLogged()
      console.log(blogs)
      setUsername('')
      setPassword('')
    } catch (exception) {
        setNotif("wrong username or password")
        setTimeout(() => {
          setNotif('')
        }, 3000)
    }
  }

  function flipVisibility (index) {
    const varBlogs = [...blogs]
    varBlogs[index] = {...varBlogs[index],
      visible: !varBlogs[index].visible
    }
    setBlogs(varBlogs)
  }

  function addLike (localBlog) {
    const newBlog = {...localBlog.full,
      likes: localBlog.full.likes + 1
    }
    pt05blogSer.update(localBlog.full.id, newBlog)
    const newLocalBlog = {
      visible: localBlog.visible,
      full: newBlog
    }
    const updatedBlogs = blogs.map(
      (aBlog) => {
        return aBlog.full.id === localBlog.full.id ? newLocalBlog : aBlog
    }
    )
    setBlogs(updatedBlogs)
  } 

  const React2Blogs = ({ theBlogs }) => {
    let readyHtml = []
    for (let i = 0; i < theBlogs.length; i++) {
      const fullBlog = theBlogs[i].full
      if (theBlogs[i].visible === false) {
        readyHtml.push(
          <div>
            {fullBlog.title + " " + fullBlog.author}
            <button onClick={() => flipVisibility(i)}>
              view
            </button>
          </div>
        )
      } else {
        readyHtml.push(
          <div style={{border: "1px solid black"}}>
            {fullBlog.title + " " + fullBlog.author}
            <button onClick={() => flipVisibility(i)}>
              hide
            </button>
            <br/>
            {fullBlog.url}
            <br/>
            <span>likes&nbsp;</span>
            {fullBlog.likes}
            <button onClick={() => addLike(theBlogs[i])}>like</button>
            <br/>
            {user.name}
          </div>
        )
      }
    }
    return readyHtml
  }

  const addBlog = async (blog) => {

    appRef.current.toggleVisibility()
  
    await pt05blogSer.create(blog)

    dataOfLogged()

    setNotif("a new blog " + blog.title + " by " + blog.author + " added")
    setTimeout(() => {
      setNotif('')
    }, 3000)
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
        <Togglable buttonLabel="new blog" ref={appRef}>
          <BlogForm addBlog={addBlog}/>
        </Togglable>
        <React2Blogs theBlogs={blogs}/>
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