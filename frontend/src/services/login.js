import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/login'
//you may need to specify the baseUrl in other services in the future just like here

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const stepLogin = { login: login }

export default stepLogin