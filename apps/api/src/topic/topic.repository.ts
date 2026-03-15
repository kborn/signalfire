import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicRepository {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Topic[]> {
    return this.prisma.topic.findMany();
  }

  findBySlug(slug: string): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { slug: slug },
    });
  }
}
