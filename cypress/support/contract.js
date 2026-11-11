import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

export function expectToMatchSchema(schema, body) {
  const validate = ajv.compile(schema);
  const valid = validate(body);

  expect(valid, `schema "${schema.title}": ${ajv.errorsText(validate.errors, { dataVar: 'body' })}`)
    .to.be.true;
}
