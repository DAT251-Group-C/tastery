describe('Create recipe', () => {
 it('should log in and create recipe', () => {
    // Login
    cy.visit('https://tastery.no/signin');
    cy.get('input[type="email"]').type('kta035@uib.no');
    cy.get('input[type="password"]').type('testtesttest123');
    cy.get('button[type="submit"]').click();

    // Create recipe
    cy.get('button[aria-label="Create recipe"]').click();

    cy.get('input[placeholder="Recipe name"]').type('Spaghetti Carbonara');
    cy.get('textarea[placeholder="Recipe description"]').type('Classic and simple recipe for Spaghetti Carbonara');
    cy.get('input[placeholder="Italian, Pasta, Spicy"]').type('Italian, Pasta');
    cy.get('textarea[placeholder="1. Start by ..."]').type('1. Cook the spaghetti. 2. Prepare the sauce. 3. Combine eggs and cheese. 4. Combine everything. 5. Add egg mixture. 6. Season and serve.');

    // Spaghetti 200g
    cy.get('button[aria-label="Add ingredient"]').click();
    cy.get('input[data-pc-section="root"]').eq(2).type('spaghetti');
    cy.get('input[role="spinbutton"]').type('200');

    // 100g Bacon
    cy.get('button[aria-label="Add ingredient"]').eq(1).click();
    cy.get('input[data-pc-section="root"]').eq(4).type('bacon');
    cy.get('input[role="spinbutton"]').eq(1).type('100');

    cy.get('button[aria-label="Save"]').click();
  });
});
