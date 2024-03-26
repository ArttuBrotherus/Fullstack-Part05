describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset')

		const userData = {
			name: 'Test User',
			username: 'testuser',
			password: 'DragonPassword'
		}

		cy.request('POST', 'http://localhost:3001/api/users/', userData)

		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function () {
		cy.contains('login')
		cy.get('#username')
		cy.get('#password')
	})

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('#username').type('testuser')
			cy.get('#password').type('DragonPassword')

			cy.contains('login').click()
			cy.contains('create new')
		})

		it('fails with wrong credentials', function () {
			cy.get('#username').type('testuser')
			cy.get('#password').type('incorrect')

			cy.contains('login').click()
			cy.contains('Error. Wrong username or password?')
		})

	})

	describe('When logged in', function () {
		beforeEach(function () {
			cy.get('#username').type('testuser')
			cy.get('#password').type('DragonPassword')

			cy.contains('login').click()
		})

		it('A blog can be created', function () {
			cy.contains('new blog').click()

			cy.get('input[placeholder="write title here"]').type("Reserving judgement")
			cy.get('input[placeholder="write author here"]').type("Matthew J. Phillips")
			cy.get('input[placeholder="write url here"]').type("res/jud")

			cy.get('#create-button').click()
			cy.contains('Reserving judgement')
		})

		it('Ex. 5.20', function () {
			cy.contains('new blog').click()
			cy.get('input[placeholder="write title here"]').type("Reserving judgement")
			cy.get('input[placeholder="write author here"]').type("Matthew J. Phillips")
			cy.get('input[placeholder="write url here"]').type("res/jud")
			cy.get('#create-button').click()

			cy.contains('view').click()
			for (let n = 0; n < 3; n++) {
				cy.get('#like-button').click()
			}
			cy.contains('3')
		})

		it('Ex. 5.21', function () {
			cy.contains('new blog').click()
			cy.get('input[placeholder="write title here"]').type("Reserving judgement")
			cy.get('input[placeholder="write author here"]').type("Matthew J. Phillips")
			cy.get('input[placeholder="write url here"]').type("res/jud")
			cy.get('#create-button').click()
			cy.contains('view').click()

			cy.contains('remove').click()
			cy.on('window:confirm', () => true)

			cy.contains('Matthew').should('not.exist')
			cy.contains('view').should('not.exist')
		})

		it('Ex. 5.22', function() {
			//creating another user
			const MrX = {
				name: 'Xoon Menly',
				username: 'Mr. X',
				password: 'raccoonpolitics'
			}
			cy.request('POST', 'http://localhost:3001/api/users/', MrX)

			//data of the blogs added by testuser
			const testuserData = [
				[
					"Reserving judgement",
					"Matthew J. Phillips",
					"res/jud"
				],
				[
					"Unscientific mutation",
					"Chris Valentine",
					"sta/rs"
				]
			]

			//adding testuser's data
			for (let entry of testuserData) {
				cy.contains('new blog').click()
				cy.get('input[placeholder="write title here"]').type(entry[0])
				cy.get('input[placeholder="write author here"]').type(entry[1])
				cy.get('input[placeholder="write url here"]').type(entry[2])
				cy.get('#create-button').click()
			}

			//viewing blog data + removing the first blog
			cy.contains('view').click()
			cy.contains('view').click()
			cy.contains('remove').click()
			cy.on('window:confirm', () => true)
			cy.contains('remove')

			//logging out + logging in as Mr. X
			cy.contains('logout').click()
			cy.get('#username').type('Mr. X')
			cy.get('#password').type('raccoonpolitics')
			//
			cy.contains('login').click()

			//is it possible to remove testuser's blog (does it have the remove button)?
			cy.contains('view').click()
			cy.contains('remove').should('not.exist')
		})

		it('Ex. 5.23', function() {
			//adding testuser's data
			const ex23data = [
				[
					"Reserving judgement",
					"Matthew J. Phillips",
					"res/jud"
				],
				[
					"Unscientific mutation",
					"Chris Valentine",
					"sta/rs"
				],
				[
					"Organ donation",
					"Poe Dullard",
					"mal/lard"
				]
			]

			//adding testuser's data
			for (let entry of ex23data) {
				cy.get('#reveal-button').click()
				cy.get('input[placeholder="write title here"]').type(entry[0])
				cy.get('input[placeholder="write author here"]').type(entry[1])
				cy.get('input[placeholder="write url here"]').type(entry[2])
				cy.get('#create-button').click()
			}

			//waiting until all the blogs can be seen
			cy.contains('added').should('not.exist')

			//giving each blog a different amount of likes
			const likes = [5, 2, 7]
			for (let n = 0; n < 3; n++) {
				cy.get("div[name=mapped-blogs] > div").eq(n).contains('view').click()
				for (let like = 0; like < likes[n]; like++) {
					cy.get('#like-button').click()
				}
				cy.contains('hide').click()
			}

			//reloading the page => ascertaining the order of the blogs
			cy.reload()
			cy.get("div[name=mapped-blogs] > div").eq(0).contains('Dullard')
			cy.get("div[name=mapped-blogs] > div").eq(1).contains('Reserving')
			cy.get("div[name=mapped-blogs] > div").eq(2).contains('Unscientific')
		})
	})
})