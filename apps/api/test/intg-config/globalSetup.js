const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { execSync } = require('child_process');

const POSTGRES_IMAGE = 'postgres:15-alpine';
const CONTAINER_START_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startPostgresContainer() {
  let lastError;

  for (let attempt = 1; attempt <= CONTAINER_START_RETRIES; attempt += 1) {
    try {
      return await new PostgreSqlContainer(POSTGRES_IMAGE)
        .withDatabase('test_db')
        .withUsername('user')
        .withPassword('password')
        .start();
    } catch (error) {
      lastError = error;

      if (attempt === CONTAINER_START_RETRIES) {
        break;
      }

      console.warn(
        `Postgres test container start failed on attempt ${attempt}/${CONTAINER_START_RETRIES}. Retrying in ${RETRY_DELAY_MS}ms...`,
      );
      await sleep(RETRY_DELAY_MS);
    }
  }

  throw lastError;
}

module.exports = async () => {
  // 1. Start the container once
  const container = await startPostgresContainer();

  // 2. Save the dynamic connection info to env vars for the tests to use
  process.env.DATABASE_URL = container.getConnectionUri();

  // 3. Store the container instance globally so we can stop it later
  global.__INTG_DB_CONTAINER__ = container;

  // 4. Run migration
  execSync('pnpm prisma:migrate:deploy', { env: { ...process.env } });

  // 5. Run seed
  execSync('pnpm prisma:migrate:seed', { env: { ...process.env, SEED_MODE: 'baseline' } });

  console.log('\nIntegration database started.');
};
