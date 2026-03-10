import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get('live')
  @HealthCheck()
  check() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  check_db() {
    return this.health.check([() => this.db.pingCheck('database', this.prisma)]);
  }
}
