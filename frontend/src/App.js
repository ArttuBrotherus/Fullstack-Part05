import { useState, useEffect } from 'react'
import personService from './services/persons'
import loginService from './services/login'

const Person = (props) => {
  
  const DeleteData = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${props.name} ?`)) {
      personService.deletePerson(props.luku)
      .then(response => {
      personService.
      getAll()
      .then(response2 => {
        props.setPersons(response2.data)
      })
    })
    }
    }

  return(
    <div>
        {props.name} {props.phone}&nbsp;
        <button onClick={DeleteData}>
          delete
        </button>
    </div>
  )
}

const PhoneForm = (props) => {
  return(
    <div>
      <form onSubmit={props.addDetail}>
          <div>
            name: <input 
              value={props.newName}
              onChange={props.handleName}
            />
          </div>
          <div>
            number: <input 
              value={props.upcomingNo}
              onChange={props.updateNo}
            />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [upcomingNo, editNo] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService.
      getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const AllPersons = () => {
    return(
      <>
        {persons.map(p => <Person setPersons={setPersons} phone={p.number} name={p.name} luku={p.id} key={p.id} />)}
      </>
    )
  }

  const addDetail = (event) => {
    event.preventDefault()
    const matchingName = persons.filter(p => p.name == newName)
    if(matchingName.length > 0) {
      alert(`${newName} is already added to phonebook`)
    }else{
      personService
        .create({
          "name": newName,
          "number": upcomingNo
        })
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response.data))
        })
      setNewName('')
      editNo('')
    }
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const updateNo = (event) => {
    editNo(event.target.value)
  }

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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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

export default App