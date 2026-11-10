import { buildAdminUser } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import { userService } from '../../support/services/userService';
import { authService } from '../../support/services/authService';
import { productPage } from '../../support/pages/ProductPage';

describe('UI - Admin product management', () => {
  let admin;
  let adminId;
  let adminToken;
  let product;

  before(() => {
    admin = buildAdminUser();

    userService.create(admin).then(({ status, body }) => {
      expect(status, 'admin setup').to.eq(201);
      adminId = body._id;
    });

    authService.login(admin).then(({ status, body }) => {
      expect(status, 'admin login setup').to.eq(200);
      adminToken = body.authorization;
    });
  });

  beforeEach(() => {
    product = buildProduct();
    cy.loginAs(admin);
  });

  afterEach(() => {
    cy.deleteProductByName(product.nome, adminToken);
  });

  after(() => {
    if (adminId) userService.remove(adminId);
  });

  it('lets an admin create a product and see it in the product list', () => {
    productPage.create(product);

    cy.location('pathname').should('eq', '/admin/listarprodutos');
    productPage.heading.should('contain', 'Lista dos Produtos');
    productPage.rowFor(product.nome).should('be.visible').and('contain', product.preco);
  });
});
