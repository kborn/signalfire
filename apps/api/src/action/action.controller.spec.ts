import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { NotFoundException } from '@nestjs/common';
import { buildActionDetailResponse, buildActionListResponse } from './action.test-fixtures';

describe('ActionController', () => {
  let actionController: ActionController;
  const serviceMock = {
    getActionList: jest.fn(),
    getActionDetail: jest.fn(),
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
    serviceMock.getActionDetail.mockResolvedValue(actionDetailResponse);

    const slug = 'test';
    const ret = await actionController.findAction(slug);
    expect(ret).toEqual(actionDetailResponse);
    expect(serviceMock.getActionDetail).toHaveBeenCalledWith(slug);
  });

  it('findActions', async () => {
    const actionListResponse = buildActionListResponse();
    serviceMock.getActionList.mockResolvedValue(actionListResponse);

    const ret = await actionController.findActions();
    expect(ret).toEqual(actionListResponse);
    expect(serviceMock.getActionList).toHaveBeenCalledWith(undefined);
  });

  it('findActions with topicSlug', async () => {
    const actionListResponse = buildActionListResponse();
    serviceMock.getActionList.mockResolvedValue(actionListResponse);

    const ret = await actionController.findActions('democracy');
    expect(ret).toEqual(actionListResponse);
    expect(serviceMock.getActionList).toHaveBeenCalledWith('democracy');
  });

  it('findActionNotFound', async () => {
    serviceMock.getActionDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(actionController.findAction(slug)).rejects.toThrow(NotFoundException);
  });
});
