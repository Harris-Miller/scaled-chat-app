import { jwt } from '@elysiajs/jwt';

export const jwtInstance = jwt({
  name: 'jwt',
  secret: 'beyond',
});
