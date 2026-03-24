import { Test } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

export type E2EHarness = {
  readonly app: INestApplication<App>;
  readonly httpServer: ReturnType<INestApplication<App>['getHttpServer']>;
};

export function setupE2ETest(): E2EHarness {
  let app: INestApplication<App> | undefined;
  let httpServer: App;
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(jestPrisma.client as PrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  return {
    get app(): INestApplication<App> {
      if (!app) {
        throw new Error('E2E harness module accessed before setup completed.');
      }
      return app;
    },
    get httpServer(): ReturnType<INestApplication<App>['getHttpServer']> {
      if (!httpServer) {
        throw new Error('E2E harness module accessed before setup completed.');
      }
      return httpServer;
    },
  };
}
