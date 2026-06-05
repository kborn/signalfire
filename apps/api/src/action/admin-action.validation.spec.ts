import { BadRequestException } from '@nestjs/common';
import { ActionType, EntityStatus } from '@prisma/client';
import { validateAdminActionRequest } from './admin-action.validation';

describe('validateAdminActionRequest', () => {
  it('trims and accepts a valid request', () => {
    expect(
      validateAdminActionRequest({
        title: '  Call Your Representative  ',
        summary: '  A short summary.  ',
        description: '  A longer description.  ',
        actionType: ActionType.CONTACT,
        topicSlugs: ['  democracy  ', '  local-community  '],
        status: EntityStatus.PUBLISHED,
      }),
    ).toEqual({
      title: 'Call Your Representative',
      summary: 'A short summary.',
      description: 'A longer description.',
      actionType: ActionType.CONTACT,
      topicSlugs: ['democracy', 'local-community'],
      status: EntityStatus.PUBLISHED,
    });
  });

  it('rejects invalid requests with field errors', () => {
    expect(() =>
      validateAdminActionRequest({
        title: '  ',
        summary: '',
        description: 'desc',
        actionType: 'CONTACT',
        topicSlugs: [],
        status: 'PUBLISHED',
      }),
    ).toThrow(BadRequestException);
  });
});
