import Notification from "./notification"
import { useState } from 'react'

const LoginForm = ({ handleLogin, notification }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const loginEvent = async (event) => {
		event.preventDefault()

		handleLogin(username, password)
		setUsername('')
		setPassword('')
	}

	return (
		<div>
			<h2>log into application</h2>
			<Notification message={notification} />
			<form onSubmit={loginEvent}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="Username"
						onChange={({ target }) => setUsername(target.value)}
						placeholder='give username here'
					/>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						name="Password"
						onChange={({ target }) => setPassword(target.value)}
						placeholder='give password here'
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
} // end component

export default LoginForm