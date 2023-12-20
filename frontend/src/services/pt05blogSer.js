import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'
//3001: The blogs are here
//'http://localhost:3000/api/login'

let token = null

const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}


const create = async newObject => {
	const config = {
		headers: { Authorization: token },
	}


	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async (id, newObject) => {
	const config = {
		headers: { Authorization: token },
	}

	await axios.put(`${ baseUrl }/${id}`, newObject, config)
}

const remove = async (id) => {
	const config = {
		headers: { Authorization: token }
	}

	await axios.delete(`${ baseUrl }/${id}`, config)
}

export default { getAll, setToken, create, update, remove }