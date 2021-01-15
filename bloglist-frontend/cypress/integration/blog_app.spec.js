describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser({ name: 'Cypress Tester', username: 'c_tester', password: 'secretPassword' })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')

    cy.get('#loginForm')
      .should('contain', 'username')
      .should('contain', 'password')

    cy.get('#username').should('exist')
    cy.get('#username').should('exist')

    cy.get('#login-button')
      .should('contain', 'login')

    cy.get('#notification')
      .should('not.exist')

    cy.contains('blogs')
      .should('not.exist')
  })

  describe('Login',function() {
    beforeEach(function() {
      localStorage.removeItem('loggedBlogAppUser')
      cy.reload()
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('c_tester')
      cy.get('#password').type('secretPassword')
      cy.get('#login-button').click()

      cy.get('#notification')
        .should('contain', 'Login succesful')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
        .and('not.contain', 'wrong username or password')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong_username')
      cy.get('#password').type('wrong_secretPassword')
      cy.get('#login-button').click()

      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
        .and('not.contain', 'Login succesful')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'c_tester', password: 'secretPassword' })
    })

    it('A blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('cypress blog')
      cy.get('#author').type('cypress author')
      cy.get('#url').type('https://www.urlbycypress.com')
      cy.get('#create-blog-button').click()

      cy.contains('cypress blog')
        .should('have.css', 'border-style', 'solid')
        .parent()
        .should('contain', 'view')

      cy.contains('https://www.urlbycypress.com')
        .parent()
        .should('not.be.visible')

      cy.get('#notification')
        .should('contain', 'a new blog cypress blog by cypress author added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('not.contain', 'blog creation failed')
    })

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'blog one', author: 'author one', url: 'url one' })
        cy.createBlog({ title: 'blog two', author: 'author two', url: 'url two' })
        cy.createBlog({ title: 'blog three', author: 'author three', url: 'url three' })
      })

      it('one of them can be liked', function () {
        cy.contains('blog two')
          .parent()
          .contains('view').click()
          .should('contain', 'hide')

        cy.contains('url two')
          .parent()
          .should('be.visible')
          .contains('like').click()
          .parent()
          .should('contain', '1')
      })

      it('an owner can delete blog', function () {
        cy.contains('blog one')
          .parent()
          .contains('view').click()

        cy.contains('blog one')
          .parent()
          .contains('remove').click()

        cy.get('html')
          .should('not.contain', 'blog one')
      })

      it('cant delete other users blog', function () {
        localStorage.removeItem('loggedBlogAppUser')
        cy.reload()

        cy.createUser({ name: 'user two', username: 'userTwo', password: 'passwordTwo' })
        cy.login({ username: 'userTwo', password: 'passwordTwo' })

        cy.contains('blog one')
          .parent()
          .contains('view').click()

        cy.contains('url one')
          .parent()
          .should('be.visible')
          .contains('remove')
          .parent()
          .should('not.be.visible')
      })

      it.only('blogs are ordered by likes descending', function () {
        cy.get('.toggle-view-button').each($btn => {
          cy.wrap($btn).click()
        })

        cy.get('.blogTitle').then($div => {
          cy.wrap($div[0]).should('contain', 'blog one')
          cy.wrap($div[1]).should('contain', 'blog two')
          cy.wrap($div[2]).should('contain', 'blog three')
        })

        cy.get('.like-button').then($btn => {
          cy.wrap($btn[2]).click()
          cy.wrap($btn[1]).click()
          cy.wrap($btn[1]).click()
          cy.wrap($btn[2]).click()
          cy.wrap($btn[1]).click()
          cy.wrap($btn[0]).click()
        })

        cy.get('.blogTitle').then($div => {
          cy.wrap($div[0]).should('contain', 'blog two')
          cy.wrap($div[1]).should('contain', 'blog three')
          cy.wrap($div[2]).should('contain', 'blog one')
        })
      })
    })

  })
})