const js = require('@eslint/js');
const globals = require('globals');
const cypress = require('eslint-plugin-cypress');
const prettier = require('eslint-config-prettier');

module.exports = [
  { ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: { sourceType: 'module' },
  },
  cypress.configs.recommended,
  prettier,
];
