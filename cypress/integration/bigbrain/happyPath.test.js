/// <reference types="cypress" />

// eslint-disable-next-line no-undef
context('Admin Flow - Happy Path', () => {
  beforeEach(() => {
    cy.exec('cd .. && npm run reset && npm run restart');
    cy.visit('localhost:3000');
  });

  it('Successfully signs up', () => {
    /**
     * Data
     */
    const admin = {
      email: 'jim@jim.com',
      name: 'jim',
      password: 'jim123',
    };

    const quiz = {
      name: 'New Quiz',
    };

    /**
     * Register
     */
    cy.get('header a[href="/register"]')
      .click();

    cy.get('input[name=email]')
      .focus()
      .type(admin.email);

    cy.get('input[name=name]')
      .focus()
      .type(admin.name);

    cy.get('input[name=password]')
      .focus()
      .type(admin.password);

    cy.get('button[type=submit]')
      .click();

    /**
     * Create Quiz
     */
    cy.get('button#add-quiz')
      .click();

    cy.get('input[name=name]')
      .focus()
      .type(quiz.name);

    cy.get('button[type=submit]')
      .click();

    /**
     * Add question to quiz
     */
    cy.get('a[href^="/admin/edit/"]')
      .click();

    cy.get('button#add-question')
      .click();

    cy.get('#root a[href="/admin"]')
      .contains('Back to dashboard')
      .click();

    /**
     * Start quiz
     */
    cy.get('button[id^="start-quiz-"]')
      .click();

    /**
     * Stop Quiz
     */
    cy.get('button[aria-label="Close"]')
      .click();

    cy.get('button[id^="stop-quiz-"]')
      .click();

    /**
     * View Results
     */
    cy.get('a[href^="/admin/results/"]')
      .click();

    /**
     * Log out
     */
    cy.get('button#logout')
      .click();

    /**
     * Log in
     */
    cy.get('header a[href="/login"]')
      .click();

    cy.get('input[name=email]')
      .focus()
      .type(admin.email);

    cy.get('input[name=password]')
      .focus()
      .type(admin.password);

    cy.get('button[type=submit]')
      .click();
  });
});
