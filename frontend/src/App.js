import { useState, useEffect } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'
import LoginForm from './components/loginform'
import BlogsView from './components/LocalBlogs'

const App = () => {
	const [user, setUser] = useState(null)
	const [notification, setNotif] = useState('')

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			pt05blogSer.setToken(user.token)
			fetchBlogData()
		}
	}, [])

	const handleLogin = async (username, password) => {

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
			fetchBlogData()
		} catch (exception) {
			setNotif("wrong username or password")
			setTimeout(() => {
				setNotif('')
			}, 3000)
		}
	}

	return (
		<div>
			{user === null ?
				<LoginForm handleLogin={handleLogin} notification={notification} />
				: <BlogsView notification={notification} user={user} setNotif={setNotif} />}
		</div>
	)
}

export default { App: App }