import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  const pingMock = { pingCheck: jest.fn() };
  const prismaMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule], // real HealthCheckService
      controllers: [HealthController],
      providers: [
        { provide: PrismaHealthIndicator, useValue: pingMock }, // mocked
        { provide: PrismaService, useValue: prismaMock }, // mocked
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('live return ok', () => {
    expect(controller.check()).toEqual({ status: 'ok' });
  });

  it('readiness success returns ok when db is up', async () => {
    pingMock.pingCheck.mockResolvedValue({ database: { status: 'up' } });

    await expect(controller.check_db()).resolves.toEqual(
      expect.objectContaining({
        status: 'ok',
      }),
    );

    expect(pingMock.pingCheck).toHaveBeenCalledWith('database', prismaMock);
  });

  it('readiness failure propagates unhealthy behavior', async () => {
    const healthError = Object.assign(new Error('db down'), {
      isHealthCheckError: true,
      causes: { database: { status: 'down' } },
    });

    pingMock.pingCheck.mockRejectedValue(healthError);

    await expect(controller.check_db()).rejects.toThrow('Service Unavailable Exception');
    expect(pingMock.pingCheck).toHaveBeenCalledWith('database', prismaMock);
  });
});
