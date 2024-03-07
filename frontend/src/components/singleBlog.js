const SingleBlog = ({ blogData, flipVisibility, addLike, removeButton, user }) => {
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
				<button id="like-button" onClick={() => addLike(blogData)}>like</button>
				<br />
				{user.name}
				{removeButton === undefined ? null : removeButton(mongoBlog)}
			</div>
		)
	}
}

export default SingleBlog