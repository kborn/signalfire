const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { PrismaEnvironmentDelegate } = require('@quramy/jest-prisma-core');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

class PrismaPgEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.delegate = new PrismaEnvironmentDelegate(config, context);
  }

  async setup() {
    const jestPrisma = await this.delegate.preSetup();
    await super.setup();
    this.global.jestPrisma = jestPrisma;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL');
    }

    jestPrisma.initializeClient(
      new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
      }),
    );
  }

  handleTestEvent(event) {
    return this.delegate.handleTestEvent(event);
  }

  async teardown() {
    await Promise.all([super.teardown(), this.delegate.teardown()]);
  }
}

module.exports = PrismaPgEnvironment;
