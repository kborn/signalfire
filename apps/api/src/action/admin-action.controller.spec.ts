import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { AdminActionController } from './admin-action.controller';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';
import { ActionType, EntityStatus } from '@prisma/client';

describe('AdminActionController', () => {
  let controller: AdminActionController;

  const serviceMock = {
    create: jest.fn(),
    update: jest.fn(),
    getAdminActionList: jest.fn(),
    getAdminActionDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminActionController],
      providers: [{ provide: ActionService, useValue: serviceMock }],
    }).compile();

    controller = app.get(AdminActionController);
  });

  it('create maps unknown topic errors to BadRequestException', async () => {
    serviceMock.create.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.create({
        title: 'Call Your Representative',
        summary: 'Summary',
        description: 'Description',
        actionType: ActionType.CONTACT,
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update maps unknown topic errors to BadRequestException', async () => {
    serviceMock.update.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.update('call-your-representative', {
        title: 'Call Your Representative',
        summary: 'Summary',
        description: 'Description',
        actionType: ActionType.CONTACT,
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
