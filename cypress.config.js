const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    env: {
      apiUrl: 'https://serverest.dev',
    },
  },
});
