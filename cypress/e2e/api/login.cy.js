import { buildUser } from '../../support/factories/userFactory';
import { userService } from '../../support/services/userService';
import { authService } from '../../support/services/authService';

describe('API - Login', () => {
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

  it('logs in with valid credentials and returns a bearer token', () => {
    authService.login(user).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.message).to.eq('Login realizado com sucesso');
      expect(body.authorization).to.match(/^Bearer .+/);
    });
  });

  it('rejects a wrong password without issuing a token', () => {
    authService.login({ ...user, password: 'WrongPass@999' }).then(({ status, body }) => {
      expect(status).to.eq(401);
      expect(body.message).to.eq('Email e/ou senha inválidos');
      expect(body).to.not.have.property('authorization');
    });
  });
});
