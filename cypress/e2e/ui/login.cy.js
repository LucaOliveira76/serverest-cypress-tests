import { buildUser } from '../../support/factories/userFactory';
import { userService } from '../../support/services/userService';
import { loginPage } from '../../support/pages/LoginPage';

describe('UI - Login', () => {
  let user;
  let userId;

  before(() => {
    user = buildUser();
    userService.create(user).then(({ status, body }) => {
      expect(status, 'user setup').to.eq(201);
      userId = body._id;
    });
  });

  after(() => {
    if (userId) userService.remove(userId);
  });

  it('logs in with valid credentials and lands on the home page', () => {
    loginPage.login(user);

    cy.location('pathname').should('eq', '/home');
  });

  it('shows an error and stays on the login page with a wrong password', () => {
    loginPage.login({ ...user, password: 'WrongPass@999' });

    loginPage.alert.should('be.visible').and('contain', 'Email e/ou senha inválidos');
    cy.location('pathname').should('eq', '/login');
  });
});
