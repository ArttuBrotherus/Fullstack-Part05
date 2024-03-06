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
			cy.contains('wrong username or password')
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

	})
})