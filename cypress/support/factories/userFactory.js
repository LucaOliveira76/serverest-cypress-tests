import { faker } from '@faker-js/faker';

export function buildUser(overrides = {}) {
  return {
    nome: faker.person.fullName(),
    email: `qa.${faker.string.alphanumeric({ length: 12, casing: 'lower' })}@example.com`,
    password: faker.internet.password({ length: 12 }),
    administrador: 'false',
    ...overrides,
  };
}

export function buildAdminUser(overrides = {}) {
  return buildUser({ administrador: 'true', ...overrides });
}
