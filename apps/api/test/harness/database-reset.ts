import { PrismaService } from '../../src/prisma/prisma.service';

const MUTABLE_TABLES = [
  '"_submission"',
  '"_article_action"',
  '"_article_event"',
  '"_action_event"',
  '"_topic_article"',
  '"_topic_action"',
  '"_topic_event"',
  '"_article"',
  '"_action"',
  '"_event"',
].join(', ');

export async function resetIntegrationDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${MUTABLE_TABLES} RESTART IDENTITY CASCADE`);
}
