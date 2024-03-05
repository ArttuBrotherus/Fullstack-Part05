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
})