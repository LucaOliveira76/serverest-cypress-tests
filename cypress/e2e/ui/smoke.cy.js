describe('Smoke', () => {
  it('loads the login page', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').should('be.visible');
  });
});
