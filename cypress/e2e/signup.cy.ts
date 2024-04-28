describe('Signup Functionality', () => {
 it('Should get to signup page', () => {
    cy.visit('https://tastery.no/signup');

    cy.get('input[placeholder="John"]').type('Ola');
    cy.get('input[placeholder="Doe"]').type('Nordmann');
    cy.get('input[type="email"]').type('test@test.no');
    cy.get('input[type="password"]').type('testtesttest123');

    cy.get('button[type="submit"]').click();

  });

});
