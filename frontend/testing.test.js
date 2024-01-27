import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import All from './src/App'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import SingleBlog from './src/components/singleBlog'

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

describe('General tests', () => {

	test('only title and author', async () => {

		render(<SingleBlog blogData={blogDataOfTest[0]} flipVisibility={flipVisibility} addLike={addLike} removeButton={null}
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

	/*
			author: "N. Everyone",
		id: "timetobe",
		likes: 2234,
		title: "The Artist",
		url: "job/types"

	Make a test, which checks that the blog's URL and number of likes are shown when the button controlling the shown details
	has been clicked.
	*/

	test('Ex. 14', async () => {
		render(<SingleBlog blogData={blogDataOfTest[0]} flipVisibility={flipVisibility} addLike={addLike} removeButton={null}
			user={inUsersPlace}/>)
		const user = userEvent.setup()

		const viewButton = screen.getByText('view')
		expect(viewButton).toBeDefined()
		console.log("viewButton >>> " + String(viewButton))
		await user.click(viewButton)

		await waitFor(() => screen.getByText('job/types'))
		const url = screen.getByText('job/types')
		expect(url).toBeDefined()

		const likes = screen.getByText('likes')
		expect(likes).toBeDefined()
	})
})