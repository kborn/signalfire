import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  const healthMock = { check: jest.fn() };
  const pingMock = { pingCheck: jest.fn() };
  const prismaMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthMock },
        { provide: PrismaHealthIndicator, useValue: pingMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('live return ok', () => {
    expect(controller.check()).toEqual({ status: 'ok' });
  });

  it('db ping called', async () => {
    pingMock.pingCheck.mockResolvedValue({ database: { status: 'up' } });

    healthMock.check.mockImplementation(async (fns: ReadonlyArray<() => unknown>) => {
      await Promise.all(fns.map((fn) => Promise.resolve(fn())));
      return { status: 'ok' };
    });

    await controller.check_db();

    expect(healthMock.check).toHaveBeenCalled();
    expect(pingMock.pingCheck).toHaveBeenCalledWith('database', prismaMock);
  });
});
