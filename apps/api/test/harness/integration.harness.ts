import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

export type IntegrationHarness = {
  readonly module: TestingModule;
};

export function setupIntegrationTest(imports: ModuleMetadata['imports'] = []): IntegrationHarness {
  let module: TestingModule | undefined;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports,
    })
      .overrideProvider(PrismaService)
      .useValue(jestPrisma.client as PrismaService)
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  return {
    get module(): TestingModule {
      if (!module) {
        throw new Error('Integration harness module accessed before setup completed.');
      }

      return module;
    },
  };
}
