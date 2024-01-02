import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'
import Togglable from './components/togglable'
import BlogForm from './components/blogViewSepa'
import PropTypes from 'prop-types'

const App = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [blogs, setBlogs] = useState([])
	const [notification, setNotif] = useState('')
	const [userAddedBlogs, setUsAdBlogs] = useState([])

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

	Notification.propTypes = {
		message: PropTypes.string.isRequired
	}

	function logOut() {
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
			setUsername('')
			setPassword('')
		} catch (exception) {
			setNotif("wrong username or password")
			setTimeout(() => {
				setNotif('')
			}, 3000)
		}
	}

	function flipVisibility(id) {
		const varBlogs = blogs.map((oneBlog) => {
			if (oneBlog.full.id === id){
				return { ...oneBlog,
					visible: !oneBlog.visible
				}
			}else{
				return oneBlog
			}
		}
		)
		setBlogs(varBlogs)
	}

	function addLike(localBlog) {
		const newBlog = {
			...localBlog.full,
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

	function blogRemoval(mongoBlog) {
		if (window.confirm("Remove blog " + mongoBlog.title + " by " + mongoBlog.author)) {
			pt05blogSer.remove(mongoBlog.id)
			dataOfLogged()
		}
	}

	function removeButton(mongoBlog) {
		for (let userAdded of userAddedBlogs) {
			const userTitleAuthor = userAdded.title + userAdded.author
			const mongoTitleAuthor = mongoBlog.title + mongoBlog.author
			if (userTitleAuthor === mongoTitleAuthor) {
				return <div>
					<button onClick={() => blogRemoval(mongoBlog)}>
						remove
					</button>
				</div>
			}
		}
		return
	}

	const IndiBlog = ({ blogData }) => {
		const mongoBlog = blogData.full
		if (blogData.visible === false) {
			return (
				<div className='summary'>
					{mongoBlog.title + " " + mongoBlog.author}
					<button onClick={() => flipVisibility(mongoBlog.id)}>
						view
					</button>
				</div>
			)
		} else {
			return (
				<div style={{ border: "1px solid black" }} className='allDetails'>
					{mongoBlog.title + " " + mongoBlog.author}
					<button onClick={() => flipVisibility(mongoBlog.id)}>
						hide
					</button>
					<br />
					{mongoBlog.url}
					<br />
					<span>likes</span>&nbsp;
					{mongoBlog.likes}
					<button onClick={() => addLike(blogData)}>like</button>
					<br />
					{user.name}
					{removeButton(mongoBlog)}
				</div>
			)
		}
	}

	const BlogList = ({ theBlogs }) => {
		return theBlogs.map(
			(oneBlog) => <IndiBlog blogData={oneBlog} key={oneBlog.full.id} />
		)
	}

	/*
const numbers = [65, 44, 12, 4];
const newArr = numbers.map(myFunction)

function myFunction(num) {
  return num * 10;
}
*/

	const addBlog = async (blog) => {

		appRef.current.toggleVisibility()

		await pt05blogSer.create(blog)

		dataOfLogged()

		setUsAdBlogs(userAddedBlogs => userAddedBlogs.concat(blog))

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
	}

	const BlogStepping = () => {
		//define some blogs here, pass them off as parameters below
		return (
			<div>
				<BlogList theBlogs={blogs} />
			</div>
		)
	}

	const blogView = () => {
		return (
			<div>
				<h1>blogs</h1>
				<p>Mirrors</p>
				<Notification message={notification} />
				<span>{user.name} logged in</span>
				<button onClick={logOut}>logout</button>
				<p></p>
				<p></p>
				<p></p>
				<Togglable buttonLabel="new blog" ref={appRef}>
					<BlogForm addBlog={addBlog} />
				</Togglable>
				<BlogStepping />
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