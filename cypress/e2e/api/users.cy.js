import { buildUser } from '../../support/factories/userFactory';
import { userService } from '../../support/services/userService';

describe('API - Users', () => {
  const createdIds = [];

  const register = (user) =>
    userService.create(user).then((response) => {
      if (response.status === 201) createdIds.push(response.body._id);
      return response;
    });

  afterEach(() => {
    createdIds.splice(0).forEach((id) => userService.remove(id));
  });

  it('creates a user with valid data', () => {
    register(buildUser()).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq('Cadastro realizado com sucesso');
      expect(body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('rejects a duplicate email', () => {
    const user = buildUser();

    register(user);
    register(user).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('rejects an invalid payload with field-level messages', () => {
    register(buildUser({ email: 'not-an-email' })).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.email).to.eq('email deve ser um email válido');
    });
  });
});
