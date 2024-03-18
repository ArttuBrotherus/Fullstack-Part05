import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'
import LoginForm from './components/loginform'
import BlogsView from './components/LocalBlogs'

const App = () => {
	const [user, setUser] = useState(null)
	const [notification, setNotif] = useState('')

	const appRef = useRef()

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			pt05blogSer.setToken(user.token)
			setTimeout(() => {
				appRef.current.fetchBlogData()
			}, 1000)
		}
	}, [])

	const handleLogin = async (username, password) => {

		try {
			const user = await loginService.login({
				username, password,
			})
			console.log(user)

			//important: note that the term's 'loggedUser' and not something else
			window.localStorage.setItem(
				'loggedUser', JSON.stringify(user)
			)
			pt05blogSer.setToken(user.token)
			setUser(user)
			setTimeout(() => {
				appRef.current.fetchBlogData()
			}, 1000)
		} catch (exception) {
			console.error(exception)
			setNotif("Error. Wrong username or password?")
			setTimeout(() => {
				setNotif('')
			}, 3000)
		}
	}

	return (
		<div>
			{user === null ?
				<LoginForm handleLogin={handleLogin} notification={notification} />
				: <BlogsView notification={notification} user={user} setNotif={setNotif} ref={appRef} />}
		</div>
	)
}

export default { App: App }