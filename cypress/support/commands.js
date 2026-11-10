import { userService } from './services/userService';
import { loginPage } from './pages/LoginPage';
import { productService } from './services/productService';

Cypress.Commands.add('deleteUserByEmail', (email) => {
  userService.findByEmail(email).then(({ body }) => {
    (body.usuarios ?? []).forEach(({ _id }) => userService.remove(_id));
  });
});

Cypress.Commands.add('loginAs', ({ email, password }) => {
  cy.session(email, () => {
    loginPage.login({ email, password });
    cy.location('pathname').should('match', /\/home$/);
  });
});

Cypress.Commands.add('deleteProductByName', (name, token) => {
  productService.findByName(name).then(({ body }) => {
    (body.produtos ?? [])
      .filter((product) => product.nome === name)
      .forEach(({ _id }) => productService.remove(_id, token));
  });
});
