import { BadRequestException } from '@nestjs/common';
import { validateAdminLoginRequest } from './admin-auth.validation';

describe('validateAdminLoginRequest', () => {
  it('returns the parsed login request when the payload is valid', () => {
    expect(
      validateAdminLoginRequest({
        email: ' admin@example.com ',
        password: ' password123 ',
      }),
    ).toEqual({
      email: 'admin@example.com',
      password: 'password123',
    });
  });

  it('throws a bad request exception when the payload is malformed', () => {
    expect(() => validateAdminLoginRequest({ email: '', password: 123 })).toThrow(
      BadRequestException,
    );
  });
});
