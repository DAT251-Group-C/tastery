describe('Login Functionality', () => {
 it('should log in with valid credentials', () => {
    cy.visit('https://tastery.no/signin');

    cy.get('input[type="email"]').type('kta035@uib.no');
    cy.get('input[type="password"]').type('testtesttest123');

    cy.get('button[type="submit"]').click();
  });
});
