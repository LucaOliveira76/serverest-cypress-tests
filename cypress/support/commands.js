import { userService } from './services/userService';

Cypress.Commands.add('deleteUserByEmail', (email) => {
  userService.findByEmail(email).then(({ body }) => {
    (body.usuarios ?? []).forEach(({ _id }) => userService.remove(_id));
  });
});
