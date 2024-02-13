import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import All from './src/App'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import SingleBlog from './src/components/singleBlog'
import BlogsView from './src/components/LocalBlogs'

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

	const user = userEvent.setup()

	test('only title and author', async () => {

		render(<SingleBlog blogData={blogDataOfTest[0]} flipVisibility={null} addLike={addLike} removeButton={null}
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

	test('Ex. 14', async () => {
		render(<BlogsView notification={''} user={inUsersPlace} initialBlogs={blogDataOfTest} />)
		const viewButton0 = screen.getAllByText('view')[0]
		await user.click(viewButton0)

		const likes = screen.getByText('likes')
		expect(likes).toBeDefined()
		const ex14url = screen.getByText('job/types', { exact: false })
		expect(ex14url).toBeDefined()
	})
})