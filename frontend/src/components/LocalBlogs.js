import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react"
import pt05blogSer from '../services/pt05blogSer'
import SingleBlog from "./singleBlog"
import Notification from "./notification"
import Togglable from "./togglable"
import BlogForm from "./blogViewSepa"

function logOut() {
	window.localStorage.clear()
	document.location.reload()
}

const BlogsView = forwardRef((props, refs) => {
	const [blogs, setBlogs] = useState([])
	const [userAddedBlogs, setUsAdBlogs] = useState([])

	useEffect(() =>
	{
		if(props.initialBlogs !== undefined){
			setBlogs(props.initialBlogs)
		}
	},
	[props.initialBlogs])

	const appRef = useRef()

	async function blogRemoval(mongoBlog) {
		if (window.confirm("Remove blog " + mongoBlog.title + " by " + mongoBlog.author)) {
			await pt05blogSer.remove(mongoBlog.id)
			fetchBlogData()
		}
	}

	function flipVisibility(id) {
		const varBlogs = blogs.map((oneBlog) => {
			if (oneBlog.full.id === id) {
				return {
					...oneBlog,
					visible: !oneBlog.visible
				}
			} else {
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

	useImperativeHandle(refs, () => {
		return {
			fetchBlogData
		}
	})

	const addBlog = async (blog) => {

		appRef.current.toggleVisibility()

		await pt05blogSer.create(blog)

		fetchBlogData()

		//imporve this syntax (get rid of userAddedBlogs, use instead attribute in the localblog)
		setUsAdBlogs(userAddedBlogs => userAddedBlogs.concat(blog))

		props.setNotif("a new blog " + blog.title + " by " + blog.author + " added")
		setTimeout(() => {
			props.setNotif('')
		}, 3000)
	}

	return <div>
		<h1>blogs</h1>
		<Notification message={props.notification} />
		<span>{props.user.name} logged in</span>
		<button onClick={logOut}>logout</button>
		<p></p>
		<p></p>
		<p></p>
		<Togglable buttonLabel="new blog" ref={appRef}>
			<BlogForm addBlog={addBlog} />
		</Togglable>
		{blogs.map(
			(oneBlog) => <SingleBlog blogData={oneBlog} key={oneBlog.full.id}
				flipVisibility={flipVisibility} addLike={addLike} removeButton={removeButtonOptional}
				user={props.user} />
		)}
	</div>

}) // end component

BlogsView.displayName = "BlogsView"

export default BlogsView