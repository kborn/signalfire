import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { execSync, spawn, type ChildProcess } from 'child_process';
import path from 'path';
import net from 'net';
import { once } from 'events';

type RunningWebServer = {
  process: ChildProcess;
  origin: string;
};

type RunningApiServer = {
  app: INestApplication<App>;
  origin: string;
};

async function getFreePort(): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Failed to allocate a free port.'));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

async function waitForHttpReady(url: string, timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export async function startApiServer(): Promise<RunningApiServer> {
  const port = await getFreePort();
  const origin = `http://127.0.0.1:${port}`;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(jestPrisma.originalClient)
    .compile();

  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  await app.init();
  await app.listen(port, '127.0.0.1');

  await waitForHttpReady(`${origin}/topics`);

  return { app, origin };
}

export async function stopApiServer(server: RunningApiServer | null): Promise<void> {
  if (!server) {
    return;
  }

  await server.app.close();
}

export async function startWebServer(apiOrigin: string): Promise<RunningWebServer> {
  const port = await getFreePort();
  const origin = `http://127.0.0.1:${port}`;
  const repoRoot = path.resolve(__dirname, '../../../../..');

  execSync('pnpm --filter web build', {
    cwd: repoRoot,
    env: {
      ...globalThis.process.env,
      NEXT_PUBLIC_API_BASE_URL: apiOrigin,
    },
    stdio: 'pipe',
  });

  let output = '';
  const child = spawn(
    'pnpm',
    ['--filter', 'web', 'exec', 'next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: repoRoot,
      env: {
        ...globalThis.process.env,
        PORT: String(port),
        NEXT_PUBLIC_API_BASE_URL: apiOrigin,
      },
      stdio: 'pipe',
    },
  );

  child.stdout?.on('data', (chunk: Buffer | string) => {
    output += chunk.toString();
  });
  child.stderr?.on('data', (chunk: Buffer | string) => {
    output += chunk.toString();
  });

  const onExit = once(child, 'exit').then(([code, signal]) => {
    throw new Error(
      `Web server exited before becoming ready (code=${code}, signal=${signal}). Output:\n${output}`,
    );
  });

  await Promise.race([waitForHttpReady(`${origin}/submit`), onExit]);

  return { process: child, origin };
}

export async function stopWebServer(server: RunningWebServer | null): Promise<void> {
  if (!server) {
    return;
  }

  server.process.kill('SIGTERM');
  await once(server.process, 'exit');
}
