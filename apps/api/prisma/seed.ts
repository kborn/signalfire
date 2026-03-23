import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  ActionType,
  EntityStatus,
  EventType,
  PrismaClient,
  SubmissionStatus,
  SubmissionType,
} from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const seedMode = `${process.env.SEED_MODE}`.toLowerCase();

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const topics = [
  {
    slug: 'democracy',
    name: 'Democracy',
    description:
      'Issues related to democratic institutions, voting rights, election integrity, and civic participation in government.',
  },
  {
    slug: 'consumer-activism',
    name: 'Consumer Activism',
    description:
      'Actions focused on influencing corporate behavior through consumer choices such as boycotts, ethical purchasing, and corporate accountability campaigns.',
  },
  {
    slug: 'climate',
    name: 'Climate',
    description:
      'Issues related to climate change, environmental protection, sustainability, and policies affecting the planet’s ecological systems.',
  },
  {
    slug: 'civil-rights',
    name: 'Civil Rights',
    description:
      'Issues involving the protection and advancement of equal rights and liberties, including racial justice, gender equality, LGBTQ+ rights, and disability rights.',
  },
  {
    slug: 'economic-justice',
    name: 'Economic Justice',
    description:
      'Issues related to economic fairness, inequality, labor conditions, housing affordability, wages, and access to economic opportunity.',
  },
  {
    slug: 'education',
    name: 'Education',
    description:
      'Issues involving public education systems, school policy, curriculum debates, student rights, and education funding.',
  },
  {
    slug: 'local-community',
    name: 'Local Community',
    description:
      'Community-level civic engagement including local organizing, mutual aid, neighborhood initiatives, and grassroots participation.',
  },
] as const;

const demoArticles = [
  {
    slug: 'how-local-climate-policy-works',
    title: 'How Local Climate Policy Works',
    summary: 'A guide to city-level climate policy.',
    content:
      'Local climate policy shapes transit, zoning, building rules, and public investment. This article explains the main pressure points a resident can influence.',
    author: 'SignalFire Staff',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    actionSlugs: ['contact-city-council-about-transit', 'join-neighborhood-climate-coalition'],
  },
  {
    slug: 'protect-voting-access-in-your-county',
    title: 'Protect Voting Access In Your County',
    summary: 'What county-level election administration controls and how residents can intervene.',
    content:
      'Election administration is often decided close to home. This article outlines where county boards, clerks, and local advocates can protect access.',
    author: 'SignalFire Staff',
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-03-14T00:00:00.000Z'),
    topicSlugs: ['democracy', 'local-community'],
    actionSlugs: ['attend-election-board-meeting'],
  },
  {
    slug: 'draft-civic-content-playbook',
    title: 'Draft Civic Content Playbook',
    summary: 'A draft-only article used for local API filtering checks.',
    content: 'This draft article should never appear on public read routes.',
    author: 'SignalFire Staff',
    status: EntityStatus.DRAFT,
    publishedAt: null,
    topicSlugs: ['education'],
    actionSlugs: ['host-school-board-study-group'],
  },
] as const;

const demoActions = [
  {
    slug: 'contact-city-council-about-transit',
    title: 'Contact City Council About Transit',
    summary: 'Ask local officials to expand public transit funding.',
    description:
      'Call or email your local council member and ask for dedicated bus-lane funding and improved weekend service.',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works'],
  },
  {
    slug: 'join-neighborhood-climate-coalition',
    title: 'Join A Neighborhood Climate Coalition',
    summary: 'Work with local residents on recurring climate pressure campaigns.',
    description:
      'Join an existing local coalition or start a recurring organizing group focused on transit, housing, and emissions policy.',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-03-11T00:00:00.000Z'),
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works'],
  },
  {
    slug: 'attend-election-board-meeting',
    title: 'Attend An Election Board Meeting',
    summary: 'Show up to local election administration meetings and document decisions.',
    description:
      'Attend the next public election board meeting, take notes, and follow up on procedural changes that affect voting access.',
    actionType: ActionType.VOLUNTEER,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-03-14T00:00:00.000Z'),
    topicSlugs: ['democracy', 'local-community'],
    articleSlugs: ['protect-voting-access-in-your-county'],
  },
  {
    slug: 'host-school-board-study-group',
    title: 'Host A School Board Study Group',
    summary: 'A draft-only action used for local API filtering checks.',
    description: 'This draft action should never appear on public read routes.',
    actionType: ActionType.GUIDE,
    status: EntityStatus.DRAFT,
    publishedAt: null,
    topicSlugs: ['education'],
    articleSlugs: ['draft-civic-content-playbook'],
  },
] as const;

const demoEvents = [
  {
    title: 'City Hall Transit Accountability Rally',
    summary: 'Residents gather before the transportation budget vote.',
    description:
      'A public rally focused on transit expansion, clean mobility, and equitable budget priorities before the city council vote.',
    eventType: EventType.RALLY,
    status: EntityStatus.PUBLISHED,
    publishedAt: new Date('2026-04-01T12:00:00.000Z'),
    startTime: new Date('2026-04-18T17:30:00.000Z'),
    endTime: new Date('2026-04-18T19:00:00.000Z'),
    locationName: 'City Hall Plaza',
    addressRaw: '123 Main St',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19107',
    country: 'USA',
    topicSlugs: ['climate', 'local-community'],
    articleSlugs: ['how-local-climate-policy-works'],
    actionSlugs: ['contact-city-council-about-transit'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'City Hall Transit Accountability Rally',
      summary: 'Residents gather before the transportation budget vote.',
      submittedContent:
        'Community-organized rally urging city officials to prioritize transit funding and equitable mobility.',
      eventType: EventType.RALLY,
      startTime: new Date('2026-04-18T17:30:00.000Z'),
      endTime: new Date('2026-04-18T19:00:00.000Z'),
      locationName: 'City Hall Plaza',
      addressRaw: '123 Main St',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19107',
      country: 'USA',
      website: 'https://example.org/transit-rally',
      contactEmail: 'events@example.org',
      submitterFirstName: 'Jordan',
      submitterLastName: 'Lee',
      submitterEmail: 'jordan.lee@example.org',
      reviewNotes: 'Approved for demo data.',
      reviewedAt: new Date('2026-04-01T12:00:00.000Z'),
    },
  },
  {
    title: 'County Voting Access Workshop',
    summary: 'A practical workshop on monitoring county election policy.',
    description:
      'Residents learn how to follow board agendas, submit public comments, and track local election policy changes.',
    eventType: EventType.WORKSHOP,
    status: EntityStatus.DRAFT,
    publishedAt: null,
    startTime: new Date('2026-05-02T18:00:00.000Z'),
    endTime: new Date('2026-05-02T20:00:00.000Z'),
    locationName: 'North Branch Library',
    addressRaw: '450 Walnut Ave',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19123',
    country: 'USA',
    topicSlugs: ['democracy'],
    articleSlugs: ['protect-voting-access-in-your-county'],
    actionSlugs: ['attend-election-board-meeting'],
    submission: {
      submissionType: SubmissionType.EVENT,
      status: SubmissionStatus.APPROVED,
      title: 'County Voting Access Workshop',
      summary: 'A practical workshop on monitoring county election policy.',
      submittedContent:
        'An approved but not yet published workshop for local moderation and event linking checks.',
      eventType: EventType.WORKSHOP,
      startTime: new Date('2026-05-02T18:00:00.000Z'),
      endTime: new Date('2026-05-02T20:00:00.000Z'),
      locationName: 'North Branch Library',
      addressRaw: '450 Walnut Ave',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19123',
      country: 'USA',
      website: 'https://example.org/voting-workshop',
      contactEmail: 'democracy@example.org',
      submitterFirstName: 'Casey',
      submitterLastName: 'Morgan',
      submitterEmail: 'casey.morgan@example.org',
      reviewNotes: 'Approved for demo data but left unpublished.',
      reviewedAt: new Date('2026-04-03T09:00:00.000Z'),
    },
  },
] as const;

function getMode(): 'baseline' | 'demo' {
  return seedMode === 'demo' ? 'demo' : 'baseline';
}

async function seedTopics() {
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {
        name: topic.name,
        description: topic.description,
      },
      create: topic,
    });
  }
}

async function seedDemoArticles() {
  for (const article of demoArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        content: article.content,
        status: article.status,
        author: article.author,
        publishedAt: article.publishedAt,
      },
      create: {
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        status: article.status,
        author: article.author,
        publishedAt: article.publishedAt,
      },
    });
  }
}

async function seedDemoActions() {
  for (const action of demoActions) {
    await prisma.action.upsert({
      where: { slug: action.slug },
      update: {
        title: action.title,
        summary: action.summary,
        description: action.description,
        actionType: action.actionType,
        status: action.status,
        publishedAt: action.publishedAt,
      },
      create: {
        slug: action.slug,
        title: action.title,
        summary: action.summary,
        description: action.description,
        actionType: action.actionType,
        status: action.status,
        publishedAt: action.publishedAt,
      },
    });
  }
}

async function seedDemoEvents() {
  for (const event of demoEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: event.title,
        locationName: event.locationName,
        startTime: event.startTime,
      },
      select: { id: true },
    });

    if (existingEvent) {
      await prisma.event.update({
        where: { id: existingEvent.id },
        data: {
          summary: event.summary,
          description: event.description,
          eventType: event.eventType,
          status: event.status,
          publishedAt: event.publishedAt,
          endTime: event.endTime,
          addressRaw: event.addressRaw,
          city: event.city,
          region: event.region,
          postalCode: event.postalCode,
          country: event.country,
          latitude: null,
          longitude: null,
        },
      });

      await prisma.submission.upsert({
        where: { eventId: existingEvent.id },
        update: {
          status: event.submission.status,
          title: event.submission.title,
          summary: event.submission.summary,
          submittedContent: event.submission.submittedContent,
          eventType: event.submission.eventType,
          startTime: event.submission.startTime,
          endTime: event.submission.endTime,
          locationName: event.submission.locationName,
          addressRaw: event.submission.addressRaw,
          city: event.submission.city,
          region: event.submission.region,
          postalCode: event.submission.postalCode,
          country: event.submission.country,
          website: event.submission.website,
          contactEmail: event.submission.contactEmail,
          submitterFirstName: event.submission.submitterFirstName,
          submitterLastName: event.submission.submitterLastName,
          submitterEmail: event.submission.submitterEmail,
          reviewNotes: event.submission.reviewNotes,
          reviewedAt: event.submission.reviewNotes ? event.submission.reviewedAt : null,
        },
        create: {
          ...event.submission,
          eventId: existingEvent.id,
        },
      });

      continue;
    }

    await prisma.event.create({
      data: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        eventType: event.eventType,
        status: event.status,
        publishedAt: event.publishedAt,
        startTime: event.startTime,
        endTime: event.endTime,
        locationName: event.locationName,
        addressRaw: event.addressRaw,
        city: event.city,
        region: event.region,
        postalCode: event.postalCode,
        country: event.country,
        submission: {
          create: event.submission,
        },
      },
    });
  }
}

async function getTopicIds() {
  const records = await prisma.topic.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getArticleIds() {
  const records = await prisma.article.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getActionIds() {
  const records = await prisma.action.findMany({
    select: { id: true, slug: true },
  });

  return new Map(records.map((record) => [record.slug, record.id]));
}

async function getEventIds() {
  const records = await prisma.event.findMany({
    select: { id: true, title: true, locationName: true, startTime: true },
  });

  return new Map(
    records.map((record) => [
      `${record.title}::${record.locationName}::${record.startTime.toISOString()}`,
      record.id,
    ]),
  );
}

function requireId<T>(map: Map<string, T>, key: string, label: string): T {
  const id = map.get(key);
  if (!id) {
    throw new Error(`Missing ${label}: ${key}`);
  }

  return id;
}

async function connectArticleTopics(
  topicIds: Map<string, number>,
  articleIds: Map<string, number>,
) {
  for (const article of demoArticles) {
    const articleId = requireId(articleIds, article.slug, 'article');

    for (const topicSlug of article.topicSlugs) {
      await prisma.topicArticle.upsert({
        where: {
          topicId_articleId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            articleId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          articleId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectActionTopics(topicIds: Map<string, number>, actionIds: Map<string, number>) {
  for (const action of demoActions) {
    const actionId = requireId(actionIds, action.slug, 'action');

    for (const topicSlug of action.topicSlugs) {
      await prisma.topicAction.upsert({
        where: {
          topicId_actionId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            actionId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          actionId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectArticleActions(
  articleIds: Map<string, number>,
  actionIds: Map<string, number>,
) {
  for (const article of demoArticles) {
    const articleId = requireId(articleIds, article.slug, 'article');

    for (const actionSlug of article.actionSlugs) {
      await prisma.articleAction.upsert({
        where: {
          articleId_actionId: {
            articleId,
            actionId: requireId(actionIds, actionSlug, 'action'),
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          articleId,
          actionId: requireId(actionIds, actionSlug, 'action'),
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectTopicEvents(topicIds: Map<string, number>, eventIds: Map<string, number>) {
  for (const event of demoEvents) {
    const eventId = requireId(
      eventIds,
      `${event.title}::${event.locationName}::${event.startTime.toISOString()}`,
      'event',
    );

    for (const topicSlug of event.topicSlugs) {
      await prisma.topicEvent.upsert({
        where: {
          topicId_eventId: {
            topicId: requireId(topicIds, topicSlug, 'topic'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          topicId: requireId(topicIds, topicSlug, 'topic'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectArticleEvents(
  articleIds: Map<string, number>,
  eventIds: Map<string, number>,
) {
  for (const event of demoEvents) {
    const eventId = requireId(
      eventIds,
      `${event.title}::${event.locationName}::${event.startTime.toISOString()}`,
      'event',
    );

    for (const articleSlug of event.articleSlugs) {
      await prisma.articleEvent.upsert({
        where: {
          articleId_eventId: {
            articleId: requireId(articleIds, articleSlug, 'article'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          articleId: requireId(articleIds, articleSlug, 'article'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function connectActionEvents(actionIds: Map<string, number>, eventIds: Map<string, number>) {
  for (const event of demoEvents) {
    const eventId = requireId(
      eventIds,
      `${event.title}::${event.locationName}::${event.startTime.toISOString()}`,
      'event',
    );

    for (const actionSlug of event.actionSlugs) {
      await prisma.actionEvent.upsert({
        where: {
          actionId_eventId: {
            actionId: requireId(actionIds, actionSlug, 'action'),
            eventId,
          },
        },
        update: {
          assignedBy: 'seed',
        },
        create: {
          actionId: requireId(actionIds, actionSlug, 'action'),
          eventId,
          assignedBy: 'seed',
        },
      });
    }
  }
}

async function seedDemoRelationships() {
  const topicIds = await getTopicIds();
  const articleIds = await getArticleIds();
  const actionIds = await getActionIds();
  const eventIds = await getEventIds();

  await connectArticleTopics(topicIds, articleIds);
  await connectActionTopics(topicIds, actionIds);
  await connectArticleActions(articleIds, actionIds);
  await connectTopicEvents(topicIds, eventIds);
  await connectArticleEvents(articleIds, eventIds);
  await connectActionEvents(actionIds, eventIds);
}

async function seedDemo() {
  await seedDemoArticles();
  await seedDemoActions();
  await seedDemoEvents();
  await seedDemoRelationships();
}

async function main() {
  await seedTopics();

  if (getMode() === 'demo') {
    await seedDemo();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
