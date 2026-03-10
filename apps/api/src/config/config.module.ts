import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (env: Record<string, string | undefined>) => {
        const required = ['DATABASE_URL'] as const;
        for (const key of required) {
          if (!env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
          }
        }

        const portRaw = env.PORT ?? '3001';
        const port = Number(portRaw);
        if (!Number.isInteger(port) || port <= 0 || port > 65535) {
          throw new Error(`Invalid PORT value: ${portRaw}`);
        }

        return {
          NODE_ENV: env.NODE_ENV ?? 'development',
          PORT: String(port),
          DATABASE_URL: env.DATABASE_URL,
        };
      },
    }),
  ],
})
export class ConfigModule {}
