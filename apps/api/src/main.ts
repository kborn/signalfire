import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import cookieParser from 'cookie-parser';

dotenv.config({ path: '.env.local' });

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
  const prisma = app.get(PrismaService);
  prisma.enableShutdownHooks(app);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
