import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HttpLoggingInterceptor } from './common/http-logging.interceptor';
import cookieParser from 'cookie-parser';

dotenv.config({ path: '.env.local' });

const logger = new Logger('Bootstrap');

function getWebOrigins() {
  return (process.env.WEB_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: getWebOrigins(),
    methods: ['GET', 'PATCH', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const prisma = app.get(PrismaService);
  prisma.enableShutdownHooks(app);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`API listening on port ${port}`);
}
bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Failed to start', err);
  process.exit(1);
});
