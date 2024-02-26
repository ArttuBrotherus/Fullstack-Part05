import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import All from './src/App'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import SingleBlog from './src/components/singleBlog'
import BlogsView from './src/components/LocalBlogs'
import BlogForm from './src/components/blogViewSepa'

//last parameter described below
const inUsersPlace = { name: "Castr6th" }
const visibleBlog = {
	visible: true,
	full: {
		author: "N. Everyone",
		id: "timetobe",
		likes: 2234,
		title: "The Artist",
		url: "job/types"
	}
}
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

describe('General tests', () => {

	const user = userEvent.setup()

	test('only title and author', async () => {

		render(<SingleBlog blogData={blogDataOfTest[0]} flipVisibility={null} addLike={null} removeButton={null}
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

	test('Ex. 15', async () => {
		const mockLike = jest.fn()

		render(<SingleBlog blogData={visibleBlog} user={inUsersPlace} addLike={mockLike}  />)
		const likeButton = screen.getByText('like')
		await user.click(likeButton)
		await user.click(likeButton)

		expect(mockLike.mock.calls).toHaveLength(2)
	})

	test('Ex. 16', async () => {
		const mockAddBlog = jest.fn()

		render(<BlogForm addBlog={mockAddBlog}/>)
		const title = screen.getByPlaceholderText('write title here')
		const author = screen.getByPlaceholderText('write author here')
		const url = screen.getByPlaceholderText('write url here')

		await user.type(title, 'One')
		await user.type(author, 'Larry David')
		await user.type(url, 'zero/three')

		const createButton = screen.getByText('create')
		await user.click(createButton)

		expect(mockAddBlog.mock.calls).toHaveLength(1)
		expect(mockAddBlog.mock.calls[0][0]).toEqual(
			{
				title: 'One',
				author: 'Larry David',
				url: 'zero/three',
				likes: 0
			}
		)
	})
})