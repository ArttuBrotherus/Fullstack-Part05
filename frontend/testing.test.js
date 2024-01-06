import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import All from './src/App'
import userEvent from '@testing-library/user-event'
const IndiBlog = All.IndiBlog

//last parameter described below
const inUsersPlace = { name: "Castr6th" }
let blogDataOfTest = [{
	visible: false,
	full: {
		author: "N. Everyone",
		id: "timetobe",
		likes: 2234,
		title: "The Artist",
		url: "job/types"
	}
},
{
	visible: false,
	full: {
		author: "ABC",
		id: "defghi",
		likes: 2247,
		title: "Zerothree 01",
		url: "www/20"
	}
},
{
	visible: false,
	full: {
		author: "JKL",
		id: "mnopqr",
		likes: 2248,
		title: "Twenty-four 36",
		url: "www/48"
	}
}
]

function flipVisibility(id) {
	const varBlogs = blogDataOfTest.map((oneBlog) => {
		if (oneBlog.full.id === id){
			return { ...oneBlog,
				visible: !oneBlog.visible
			}
		}else{
			return oneBlog
		}
	}
	)
	blogDataOfTest = [...varBlogs]
}

function addLike(localBlog) {
	const newBlog = {
		...localBlog.full,
		likes: localBlog.full.likes + 1
	}
	const newLocalBlog = {
		visible: localBlog.visible,
		full: newBlog
	}
	const updatedBlogs = blogDataOfTest.map(
		(aBlog) => {
			return aBlog.full.id === localBlog.full.id ? newLocalBlog : aBlog
		}
	)
	blogDataOfTest = [...updatedBlogs]
}

function blogRemoval(mongoBlog) {
	const updatedBlogs = blogDataOfTest.filter((localBlog) => {
		return localBlog.full !== mongoBlog
	})
	blogDataOfTest = [ ...updatedBlogs]
}

function removeButton(mongoBlog) {
	return <div>
		<button onClick={() => blogRemoval(mongoBlog)}>
			remove
		</button>
	</div>
}

describe('General tests', () => {

	test('only title and author', async () => {

		render(<IndiBlog blogData={blogDataOfTest[0]} flipVisibility={flipVisibility} addLike={addLike} removeButton={removeButton}
			user={inUsersPlace}/>)

		const title = screen.getByText('The Artist', { exact: false })
		expect(title).toBeDefined()
		const author = screen.getByText('N. Everyone', { exact: false })
		expect(author).toBeDefined()

		const url = screen.queryByText('job/types')
		expect(url).toBeNull()
		const likes = screen.queryByText('likes')
		expect(likes).toBeNull()
	})
})