import { useState, useEffect } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'

const App = () => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

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