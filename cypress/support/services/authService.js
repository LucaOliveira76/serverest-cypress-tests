const endpoint = () => `${Cypress.expose('apiUrl')}/login`;

export const authService = {
  login({ email, password }) {
    return cy.request({
      method: 'POST',
      url: endpoint(),
      body: { email, password },
      failOnStatusCode: false,
    });
  },
};
