const selectors = {
  name: '[data-testid="nome"]',
  price: '[data-testid="preco"]',
  description: '[data-testid="descricao"]',
  quantity: '[data-testid="quantity"]',
  image: '[data-testid="imagem"]',
  submit: '[data-testid="cadastarProdutos"]',
  heading: 'h1',
};

const defaultImage = 'cypress/fixtures/product.png';

class ProductPage {
  visitForm() {
    cy.visit('/admin/cadastrarprodutos');
    return this;
  }

  fillForm({ nome, preco, descricao, quantidade }, image = defaultImage) {
    cy.get(selectors.name).type(nome, { parseSpecialCharSequences: false });
    cy.get(selectors.price).type(String(preco));
    cy.get(selectors.description).type(descricao, { parseSpecialCharSequences: false });
    cy.get(selectors.quantity).type(String(quantidade));
    cy.get(selectors.image).selectFile(image);
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  create(product) {
    return this.visitForm().fillForm(product).submit();
  }

  get heading() {
    return cy.get(selectors.heading);
  }

  rowFor(name) {
    return cy.contains('tr', name);
  }
}

export const productPage = new ProductPage();
