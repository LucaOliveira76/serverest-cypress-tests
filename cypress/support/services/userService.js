const endpoint = () => `${Cypress.expose('apiUrl')}/usuarios`;

export const userService = {
  create(user) {
    return cy.request({
      method: 'POST',
      url: endpoint(),
      body: user,
      failOnStatusCode: false,
    });
  },

  findByEmail(email) {
    return cy.request({
      method: 'GET',
      url: endpoint(),
      qs: { email },
      failOnStatusCode: false,
    });
  },

  remove(id) {
    return cy.request({
      method: 'DELETE',
      url: `${endpoint()}/${id}`,
      failOnStatusCode: false,
    });
  },
};
