const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { execSync } = require('child_process');

module.exports = async () => {
  // 1. Start the container once
  const container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('test_db')
    .withUsername('user')
    .withPassword('password')
    .start();

  // 2. Save the dynamic connection info to env vars for the tests to use
  process.env.DATABASE_URL = container.getConnectionUri();

  // 3. Store the container instance globally so we can stop it later
  global.__INTG_DB_CONTAINER__ = container;

  // 4. Run migration
  execSync('pnpm prisma:migrate:deploy', { env: { ...process.env } });

  // 5. Run seed
  execSync('pnpm prisma:migrate:seed', { env: { ...process.env } });

  console.log(`\nDatabase started at: ${process.env.DATABASE_URL}`);
};
