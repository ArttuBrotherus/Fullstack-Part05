import { useState, useEffect } from 'react'
import personService from './services/persons'

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

  return (
    <div>
      <h2>Phonebook</h2>
      <PhoneForm addDetail={addDetail} newName={newName} handleName={handleName} upcomingNo={upcomingNo} updateNo={updateNo} />
      <h2>Numbers</h2>
      <AllPersons />
    </div>
  )
}

export default App