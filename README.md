# ServeRest Cypress Tests

[Leia em português](README.pt-BR.md)

Automated test suite for [ServeRest](https://serverest.dev/) (API) and its [frontend](https://front.serverest.dev/), built with Cypress and JavaScript.

- **3 API specs, 8 tests** (users, login, products)
- **3 E2E specs, 5 tests** (registration, login, admin product management)
- Positive and negative scenarios where the application supports them

## Requirements

- Node.js 22, 24 or 26 (the versions supported by Cypress 16)
- npm

## Getting started

```bash
npm ci
```
| Command              | What it does                   |
| -------------------- | ------------------------------ |
| `npm run cy:run`     | Runs the full suite headless   |
| `npm run cy:run:api` | Runs only the API specs        |
| `npm run cy:run:ui`  | Runs only the E2E specs        |
| `npm run cy:open`    | Opens the interactive runner   |
| `npm run lint`       | Runs ESLint                    |
| `npm run format`     | Formats the code with Prettier |

### Pointing the suite at another environment

The API URL is a public value exposed through `Cypress.expose()`. Override it from the command line:

```bash
npm run cy:run:api -- --expose apiUrl=http://localhost:3000
````

The frontend URL is `baseUrl` in `cypress.config.js`. The suite needs no secrets, so there is no `.env` file.

## Project structure

```
cypress/
  e2e/
    api/        users.cy.js, login.cy.js, products.cy.js
    ui/         register.cy.js, login.cy.js, product.cy.js
  support/
    factories/  userFactory.js, productFactory.js
    pages/      RegisterPage.js, LoginPage.js, ProductPage.js
    services/   userService.js, authService.js, productService.js
    commands.js deleteUserByEmail, deleteProductByName, loginAs
    e2e.js      loads the custom commands
  fixtures/     product.png (1x1 image for the upload field)
.github/workflows/cypress.yml
```

## Test scenarios

### API

| Spec     | Scenario                              | Expected result                      |
| -------- | ------------------------------------- | ------------------------------------ |
| Users    | Create a user with valid data         | 201, success message, `_id` returned |
| Users    | Create a user with a duplicate email  | 400, duplicate-email message         |
| Users    | Create a user with an invalid payload | 400, field-level error messages      |
| Login    | Log in with valid credentials         | 200, `Bearer` token returned         |
| Login    | Log in with a wrong password          | 401, generic message, no token       |
| Products | Admin creates a product               | 201, `_id` returned                  |
| Products | Create a product without a token      | 401                                  |
| Products | Create a product as a non-admin user  | 403                                  |

### E2E

| Spec                               | Scenario                                  | Expected result                                               |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Registration                       | Register a new user                       | Redirect to `/home`, user persisted (checked through the API) |
| Registration                       | Register a duplicate email                | Alert shown, user stays on the form                           |
| Login                              | Log in with valid credentials             | Redirect to `/home`                                           |
| Login                              | Log in with a wrong password              | Alert shown, user stays on `/login`                           |
| Admin products                     | Create a product and see it listed        | Redirect to the list, product row visible                     |
| Create a product and see it listed | Redirect to the list, product row visible |

## Technical decisions

- **Layered design.** Specs only describe behavior. Selectors live in Page Objects, HTTP calls in services, and test data in factories. A change in the UI or the API is fixed in one file.
- **Design patterns.** Page Object, Factory, Service layer, and custom commands.
- **Test data.** Users and products are generated with Faker and have unique values on every run. Fixed data would collide on a shared public server.
- **Isolation and cleanup.** Each spec creates what it needs through the API and removes it afterwards, even when a test fails. Users created through the UI are removed by email, and products by exact name (the exact match protects other people's data in the shared catalog).
- **Setup is asserted.** Seed steps use labeled assertions, so a broken setup fails at its source and not as a confusing error later.
- **No fixed waits.** There is no `cy.wait(ms)` anywhere. Cypress retries every assertion until it passes or times out.
- **Assertions.** API tests check status, message, and body shape. They assert field-level errors on validation failures, so a 400 for the wrong reason does not pass. E2E tests check the URL, visible state, and persistence through the API.
- **Selectors.** `data-testid` where the application provides it. Where it does not, `role="alert"` for messages and row text for the product list.
- **Sessions.** `cy.session()` caches the admin login in the product spec, and the session id is the email so no password reaches the command log.
- **Retries.** Two retries in `run` mode only. Failures in `before` hooks are never retried.
- **Cypress 16 configuration.** Public values use `Cypress.expose()`. `cy.env()` is the channel for secrets if the suite ever needs them.

## CI/CD

The GitHub Actions workflow runs on pushes to `main`, pull requests, and manual dispatch. It installs with `npm ci`, then runs lint, API specs, and E2E specs in that order. Screenshots are uploaded as an artifact only when a step fails.
