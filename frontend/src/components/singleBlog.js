const SingleBlog = ({ blogData, flipVisibility, addLike, RemoveButton, user }) => {
	const mongoBlog = blogData.full
	if (blogData.visible === false) {
		return (
			<div className='summary'>
				{mongoBlog.title + " " + mongoBlog.author}
				<button id="view-button" onClick={() => flipVisibility(mongoBlog.id)}>
					view
				</button>
			</div>
		)
	} else {
		return (
			<div style={{ border: "1px solid black" }} className='allDetails'>
				{mongoBlog.title + " " + mongoBlog.author}
				<button id="hide-button" onClick={() => flipVisibility(mongoBlog.id)}>
					hide
				</button>
				<br />
				{mongoBlog.url}
				<br />
				<span>likes</span>&nbsp;
				{mongoBlog.likes}
				<button id="like-button" onClick={() => addLike(blogData)}>like</button>
				<br />
				{mongoBlog.user.name}
				{mongoBlog.user.username === user.username ?
					<RemoveButton mongoBlog={mongoBlog} /> : null}
			</div>
		)
	}
}

export default SingleBlog