const selectors = {
  name: '[data-testid="nome"]',
  email: '[data-testid="email"]',
  password: '[data-testid="password"]',
  adminCheckbox: '[data-testid="checkbox"]',
  submit: '[data-testid="cadastrar"]',
  alert: '[role="alert"]',
};

class RegisterPage {
  visit() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  fillForm({ nome, email, password, administrador }) {
    cy.get(selectors.name).type(nome, { parseSpecialCharSequences: false });
    cy.get(selectors.email).type(email, { parseSpecialCharSequences: false });
    cy.get(selectors.password).type(password, { parseSpecialCharSequences: false });

    if (administrador === 'true') {
      cy.get(selectors.adminCheckbox).check();
    }
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  register(user) {
    return this.visit().fillForm(user).submit();
  }

  get alert() {
    return cy.get(selectors.alert);
  }
}

export const registerPage = new RegisterPage();
