const selectors = {
  email: '[data-testid="email"]',
  password: '[data-testid="senha"]',
  submit: '[data-testid="entrar"]',
  alert: '[role="alert"]',
};

class LoginPage {
  visit() {
    cy.visit('/login');
    return this;
  }

  fillCredentials({ email, password }) {
    cy.get(selectors.email).type(email, { parseSpecialCharSequences: false });
    cy.get(selectors.password).type(password, { parseSpecialCharSequences: false });
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  login(credentials) {
    return this.visit().fillCredentials(credentials).submit();
  }

  get alert() {
    return cy.get(selectors.alert);
  }
}

export const loginPage = new LoginPage();
