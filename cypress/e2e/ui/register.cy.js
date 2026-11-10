import { buildUser } from '../../support/factories/userFactory';
import { userService } from '../../support/services/userService';
import { registerPage } from '../../support/pages/RegisterPage';

describe('UI - User registration', () => {
  let user;

  beforeEach(() => {
    user = buildUser();
  });

  afterEach(() => {
    cy.deleteUserByEmail(user.email);
  });

  it('registers a new user and redirects to the home page', () => {
    registerPage.register(user);

    cy.location('pathname').should('eq', '/home');
    userService.findByEmail(user.email).its('body.quantidade').should('eq', 1);
  });

  it('shows an error when the email is already registered', () => {
    userService.create(user).its('status').should('eq', 201);

    registerPage.register(user);

    registerPage.alert.should('be.visible').and('contain', 'Este email já está sendo usado');
    cy.location('pathname').should('eq', '/cadastrarusuarios');
  });
});
