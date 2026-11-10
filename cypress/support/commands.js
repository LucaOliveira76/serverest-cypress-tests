import { userService } from './services/userService';
import { loginPage } from './pages/LoginPage';

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
