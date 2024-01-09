import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import pt05blogSer from './services/pt05blogSer'
import Togglable from './components/togglable'
import BlogForm from './components/blogViewSepa'
import Notification from './components/notification'
import LoginForm from './components/loginform'

const IndiBlog = ({ blogData, flipVisibility, addLike, removeButton, user }) => {
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

const App = () => {
	const [user, setUser] = useState(null)
	const [blogs, setBlogs] = useState([])
	const [notification, setNotif] = useState('')
	const [userAddedBlogs, setUsAdBlogs] = useState([])

	const appRef = useRef()

	function logOut() {
		window.localStorage.clear()
		document.location.reload()
	}

	const fetchBlogData = async () => {
		const serverBlogs = await pt05blogSer.getAll()
		const sortedBlogs = serverBlogs.map((blog) => {
			return {
				visible: false,
				full: blog
			}
		}).sort((a, b) => a.full.likes - b.full.likes)
		setBlogs(sortedBlogs)
	}

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
			fetchBlogData()
		}
	}

	function removeButtonOptional(mongoBlog) {
		for (let userAdded of userAddedBlogs) {
			const userTitleAuthor = userAdded.title + userAdded.author
			const mongoTitleAuthor = mongoBlog.title + mongoBlog.author
			if (userTitleAuthor === mongoTitleAuthor) {
				return <button onClick={() => blogRemoval(mongoBlog)}>
						remove
				</button>
			}
		}
		return
	}

	const BlogList = ({ theBlogs }) => {
		return theBlogs.map(
			(oneBlog) => <IndiBlog blogData={oneBlog} key={oneBlog.full.id}
				flipVisibility={flipVisibility} addLike={addLike} removeButton={removeButtonOptional}
				user={user}/>
		)
	}

	const addBlog = async (blog) => {

		appRef.current.toggleVisibility()

		await pt05blogSer.create(blog)

		fetchBlogData()

		setUsAdBlogs(userAddedBlogs => userAddedBlogs.concat(blog))

		setNotif("a new blog " + blog.title + " by " + blog.author + " added")
		setTimeout(() => {
			setNotif('')
		}, 3000)
	}

	const blogsView = () => {
		return (
			<div>
				<h1>blogs</h1>
				<Notification message={notification} />
				<span>{user.name} logged in</span>
				<button onClick={logOut}>logout</button>
				<p></p>
				<p></p>
				<p></p>
				<Togglable buttonLabel="new blog" ref={appRef}>
					<BlogForm addBlog={addBlog} />
				</Togglable>
				<BlogList theBlogs={blogs} />
			</div>
		)
	}

	return (
		<div>
			{user === null ?
				<LoginForm handleLogin={handleLogin} notification={notification} />
				: blogsView()}
		</div>
	)
}

export default { App: App,
	IndiBlog: IndiBlog }