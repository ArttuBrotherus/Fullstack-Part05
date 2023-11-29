import { useState, useEffect } from 'react'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("A login error has occurred!")
    }
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
        <p>Blogs</p>
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