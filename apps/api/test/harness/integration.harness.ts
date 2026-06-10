import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

export type IntegrationHarness = {
  readonly module: TestingModule;
};

type IntegrationSetup = ModuleMetadata['imports'] | Pick<ModuleMetadata, 'imports' | 'providers'>;

export function setupIntegrationTest(setup: IntegrationSetup = []): IntegrationHarness {
  let module: TestingModule | undefined;
  const metadata = Array.isArray(setup) ? { imports: setup } : setup;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: metadata.imports ?? [],
      providers: metadata.providers ?? [],
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
