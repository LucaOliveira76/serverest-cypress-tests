import { buildUser, buildAdminUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { userService } from '../../support/services/userService';
import { authService } from '../../support/services/authService';
import { productService } from '../../support/services/productService';

describe('API - Products', () => {
  const userIds = [];
  const productIds = [];
  let adminToken;
  let userToken;

  const createUserAndLogin = (user) =>
    userService.create(user).then(({ status, body }) => {
      expect(status, 'user setup').to.eq(201);
      userIds.push(body._id);

      return authService.login(user).then((login) => {
        expect(login.status, 'login setup').to.eq(200);
        return login.body.authorization;
      });
    });

  const createProduct = (product, token) =>
    productService.create(product, token).then((response) => {
      if (response.status === 201) productIds.push(response.body._id);
      return response;
    });

  before(() => {
    createUserAndLogin(buildAdminUser()).then((token) => {
      adminToken = token;
    });
    createUserAndLogin(buildUser()).then((token) => {
      userToken = token;
    });
  });

  afterEach(() => {
    productIds.splice(0).forEach((id) => productService.remove(id, adminToken));
  });

  after(() => {
    userIds.forEach((id) => userService.remove(id));
  });

  it('allows an admin to create a product', () => {
    createProduct(buildProduct(), adminToken).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq('Cadastro realizado com sucesso');
      expect(body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('rejects product creation without a token', () => {
    createProduct(buildProduct()).then(({ status, body }) => {
      expect(status).to.eq(401);
      expect(body.message).to.eq(
        'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
      );
    });
  });

  it('rejects product creation by a non-admin user', () => {
    createProduct(buildProduct(), userToken).then(({ status, body }) => {
      expect(status).to.eq(403);
      expect(body.message).to.eq('Rota exclusiva para administradores');
    });
  });
});
