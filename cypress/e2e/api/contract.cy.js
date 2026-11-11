import { buildUser, buildAdminUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { userService } from '../../support/services/userService';
import { authService } from '../../support/services/authService';
import { productService } from '../../support/services/productService';
import { expectToMatchSchema } from '../../support/contract';
import createdSchema from '../../fixtures/schemas/created.json';
import messageSchema from '../../fixtures/schemas/message.json';
import loginSuccessSchema from '../../fixtures/schemas/login-success.json';
import userListSchema from '../../fixtures/schemas/user-list.json';
import productListSchema from '../../fixtures/schemas/product-list.json';

describe('API - Contract', () => {
  const userIds = [];
  const productIds = [];
  let adminToken;
  let userToken;

  const createUser = (user) =>
    userService.create(user).then((response) => {
      if (response.status === 201) userIds.push(response.body._id);
      return response;
    });

  const createProduct = (product, token) =>
    productService.create(product, token).then((response) => {
      if (response.status === 201) productIds.push(response.body._id);
      return response;
    });

  const createUserAndLogin = (user) =>
    createUser(user).then(({ status }) => {
      expect(status, 'user setup').to.eq(201);

      return authService.login(user).then((login) => {
        expect(login.status, 'login setup').to.eq(200);
        return login.body.authorization;
      });
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

  describe('Users', () => {
    it('POST /usuarios (201) matches the creation contract', () => {
      createUser(buildUser()).then(({ status, body }) => {
        expect(status).to.eq(201);
        expectToMatchSchema(createdSchema, body);
      });
    });

    it('POST /usuarios (400) matches the message contract', () => {
      const user = buildUser();

      createUser(user);
      createUser(user).then(({ status, body }) => {
        expect(status).to.eq(400);
        expectToMatchSchema(messageSchema, body);
      });
    });

    it('GET /usuarios (200) matches the user list contract', () => {
      const user = buildUser();

      createUser(user);
      userService.findByEmail(user.email).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.usuarios, 'list must not be empty').to.have.length(1);
        expectToMatchSchema(userListSchema, body);
      });
    });

    it('DELETE /usuarios/{id} (200) matches the message contract', () => {
      userService.create(buildUser()).then(({ status, body }) => {
        expect(status, 'user setup').to.eq(201);

        userService.remove(body._id).then((response) => {
          expect(response.status).to.eq(200);
          expectToMatchSchema(messageSchema, response.body);
        });
      });
    });
  });

  describe('Login', () => {
    it('POST /login (200) matches the login contract', () => {
      const user = buildUser();

      createUser(user);
      authService.login(user).then(({ status, body }) => {
        expect(status).to.eq(200);
        expectToMatchSchema(loginSuccessSchema, body);
      });
    });

    it('POST /login (401) matches the message contract', () => {
      const user = buildUser();

      createUser(user);
      authService.login({ ...user, password: 'WrongPass@999' }).then(({ status, body }) => {
        expect(status).to.eq(401);
        expectToMatchSchema(messageSchema, body);
      });
    });
  });

  describe('Products', () => {
    it('POST /produtos (201) matches the creation contract', () => {
      createProduct(buildProduct(), adminToken).then(({ status, body }) => {
        expect(status).to.eq(201);
        expectToMatchSchema(createdSchema, body);
      });
    });

    it('POST /produtos (401) matches the message contract', () => {
      createProduct(buildProduct()).then(({ status, body }) => {
        expect(status).to.eq(401);
        expectToMatchSchema(messageSchema, body);
      });
    });

    it('POST /produtos (403) matches the message contract', () => {
      createProduct(buildProduct(), userToken).then(({ status, body }) => {
        expect(status).to.eq(403);
        expectToMatchSchema(messageSchema, body);
      });
    });

    it('GET /produtos (200) matches the product list contract', () => {
      const product = buildProduct();

      createProduct(product, adminToken);
      productService.findByName(product.nome).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.produtos, 'list must not be empty').to.have.length.greaterThan(0);
        expectToMatchSchema(productListSchema, body);
      });
    });

    it('DELETE /produtos/{id} (200) matches the message contract', () => {
      productService.create(buildProduct(), adminToken).then(({ status, body }) => {
        expect(status, 'product setup').to.eq(201);

        productService.remove(body._id, adminToken).then((response) => {
          expect(response.status).to.eq(200);
          expectToMatchSchema(messageSchema, response.body);
        });
      });
    });
  });
});
