import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { NotFoundException } from '@nestjs/common';

const action = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: 'CONTACT',
  status: 'PUBLISHED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ActionController', () => {
  let actionController: ActionController;
  const serviceMock = {
    getPublishedActionDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [{ provide: ActionService, useValue: serviceMock }],
    }).compile();

    actionController = app.get<ActionController>(ActionController);
  });

  it('findAction', async () => {
    serviceMock.getPublishedActionDetail.mockResolvedValue(action);

    const slug = 'test';
    const ret = await actionController.findAction(slug);
    expect(ret).toEqual(action);
    expect(serviceMock.getPublishedActionDetail).toHaveBeenCalledWith(slug);
  });

  it('findActionNotFound', async () => {
    serviceMock.getPublishedActionDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(actionController.findAction(slug)).rejects.toThrow(NotFoundException);
  });
});
