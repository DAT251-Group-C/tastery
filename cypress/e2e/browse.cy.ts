describe('template spec', () => {
  it('browse and find spicy recipes', () => {
     cy.visit('https://tastery.no');

     cy.get('input[placeholder="Search"]').type('Spicy');

     cy.get('a[href="/recipe/237f45ff-25fe-4876-954f-7722dbe043c3"]').click();
  })
})
