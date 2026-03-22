import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { NotFoundException } from '@nestjs/common';
import { buildActionDetailResponse } from './action.test-fixtures';

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
    const actionDetailResponse = buildActionDetailResponse();
    serviceMock.getPublishedActionDetail.mockResolvedValue(actionDetailResponse);

    const slug = 'test';
    const ret = await actionController.findAction(slug);
    expect(ret).toEqual(actionDetailResponse);
    expect(serviceMock.getPublishedActionDetail).toHaveBeenCalledWith(slug);
  });

  it('findActionNotFound', async () => {
    serviceMock.getPublishedActionDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(actionController.findAction(slug)).rejects.toThrow(NotFoundException);
  });
});
