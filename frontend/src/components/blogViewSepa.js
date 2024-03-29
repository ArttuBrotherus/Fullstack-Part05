import { useState } from 'react'
import pt05blogSer from '../services/pt05blogSer'

const BlogForm = ({ addBlog }) => {
	const [newTitle, setTitle] = useState('')
	const [newAuthor, setAuthor] = useState('')
	const [newUrl, setUrl] = useState('')

	const newBlog = (event) => {
		event.preventDefault()
		addBlog({
			title: newTitle,
			author: newAuthor,
			url: newUrl,
			likes: 0
		})

		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<div>
			<h2>create new</h2>

			<form onSubmit={newBlog}>
				<p>title:
					<input
						value={newTitle}
						onChange={event => setTitle(event.target.value)}
						placeholder='write title here'
					/>
				</p>
				<p>author:
					<input
						value={newAuthor}
						onChange={event => setAuthor(event.target.value)}
						placeholder='write author here'
					/>
				</p>
				<p>url:
					<input
						value={newUrl}
						onChange={event => setUrl(event.target.value)}
						placeholder='write url here'
					/>
				</p>
				<button id="create-button" type="submit">create</button>
			</form>
		</div>
	)
}

export default BlogForm