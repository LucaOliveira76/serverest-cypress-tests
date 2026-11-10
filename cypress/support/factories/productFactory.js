import { faker } from '@faker-js/faker';

export function buildProduct(overrides = {}) {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  };
}
