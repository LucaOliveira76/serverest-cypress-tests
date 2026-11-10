const endpoint = () => `${Cypress.expose('apiUrl')}/produtos`;

const authHeader = (token) => (token ? { Authorization: token } : {});

export const productService = {
  create(product, token) {
    return cy.request({
      method: 'POST',
      url: endpoint(),
      headers: authHeader(token),
      body: product,
      failOnStatusCode: false,
    });
  },

  remove(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `${endpoint()}/${id}`,
      headers: authHeader(token),
      failOnStatusCode: false,
    });
  },
};
