import {
  EventType,
  Submission,
  SubmissionStatus,
  SubmissionType as PrismaSubmissionType,
} from '@prisma/client';
import type {
  ArticleSubmissionRequest,
  EventSubmissionRequest,
  SubmissionResponseError,
  SubmissionResponseSuccess,
} from '@signal-fire/api-contracts';

export const SUBMISSION_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');
export const SUBMISSION_EVENT_START_DATE = new Date('2026-05-14T17:00:00.000Z');
export const SUBMISSION_EVENT_END_DATE = new Date('2026-05-14T19:00:00.000Z');

type ArticleSubmissionRequestTopLevelOverrides = Partial<{
  submissionType: ArticleSubmissionRequest['submissionType'];
  author: ArticleSubmissionRequest['author'];
  submitterName: ArticleSubmissionRequest['submitterName'];
  submitterEmail: ArticleSubmissionRequest['submitterEmail'];
}>;

type ArticleSubmissionPayloadOverrides = Partial<{
  title: ArticleSubmissionRequest['payload']['title'];
  summary: ArticleSubmissionRequest['payload']['summary'];
  content: ArticleSubmissionRequest['payload']['content'];
  topicSlugs: ArticleSubmissionRequest['payload']['topicSlugs'];
  resourceLinks: ArticleSubmissionRequest['payload']['resourceLinks'];
}>;

type ArticleSubmissionRequestOverrides = ArticleSubmissionRequestTopLevelOverrides & {
  payload?: ArticleSubmissionPayloadOverrides;
};
type EventSubmissionRequestOverrides = Partial<Omit<EventSubmissionRequest, 'payload'>> & {
  payload?: Partial<EventSubmissionRequest['payload']>;
};

export function buildSubmissionEntity(overrides: Partial<Submission> = {}): Submission {
  return {
    id: 1,
    submissionType: PrismaSubmissionType.EVENT,
    status: SubmissionStatus.PENDING,
    title: 'Tenant Rights Rally',
    summary: 'Public rally supporting stronger tenant protections.',
    submittedContent: 'Join local organizers for a rally and speaker program.',
    author: 'Alex Rivera',
    submitterName: 'Alex Rivera',
    submitterEmail: 'alex@example.org',
    eventType: EventType.RALLY,
    startTime: SUBMISSION_EVENT_START_DATE,
    endTime: SUBMISSION_EVENT_END_DATE,
    locationName: 'City Hall North Plaza',
    addressRaw: '1400 John F Kennedy Blvd, Philadelphia, PA 19107, US',
    city: 'Philadelphia',
    region: 'PA',
    postalCode: '19107',
    country: 'US',
    website: null,
    contactEmail: 'press@example.org',
    reviewNotes: null,
    articleId: null,
    eventId: null,
    submittedAt: SUBMISSION_TEST_DATE,
    reviewedAt: null,
    ...overrides,
  };
}

export function buildArticleSubmissionRequest(
  overrides: ArticleSubmissionRequestOverrides = {},
): ArticleSubmissionRequest {
  const { payload: payloadOverrides, ...requestOverrides } = overrides;

  return {
    submissionType: 'ARTICLE',
    author: 'John Doe',
    submitterName: 'Jane Doe',
    submitterEmail: 'jane@example.org',
    payload: {
      title: 'How Local Organizing Works',
      summary: 'A practical explainer on local issue campaigns.',
      content: 'Full article text...',
      topicSlugs: ['local-community'],
      resourceLinks: ['https://example.org/source'],
      ...(payloadOverrides ?? {}),
    },
    ...requestOverrides,
  };
}

export function buildEventSubmissionRequest(
  overrides: EventSubmissionRequestOverrides = {},
): EventSubmissionRequest {
  const { payload: payloadOverrides, ...requestOverrides } = overrides;

  return {
    submissionType: 'EVENT',
    author: 'Alex Rivera',
    submitterName: 'Alex Rivera',
    submitterEmail: 'alex@example.org',
    payload: {
      title: 'Tenant Rights Rally',
      summary: 'Public rally supporting stronger tenant protections.',
      description: 'Join local organizers for a rally and speaker program.',
      eventType: 'RALLY',
      startDatetime: SUBMISSION_EVENT_START_DATE.toISOString(),
      endDatetime: SUBMISSION_EVENT_END_DATE.toISOString(),
      locationName: 'City Hall North Plaza',
      locationAddressStreet: '1400 John F Kennedy Blvd',
      locationAddressCity: 'Philadelphia',
      locationAddressRegion: 'PA',
      locationAddressCountry: 'US',
      locationAddressZip: '19107',
      contactEmail: 'press@example.org',
      topicSlugs: ['economic-justice'],
      resourceLinks: ['https://example.org/event'],
      ...(payloadOverrides ?? {}),
    },
    ...requestOverrides,
  };
}

export function buildSubmissionSuccessResponse(
  overrides: Partial<SubmissionResponseSuccess> = {},
): SubmissionResponseSuccess {
  return {
    id: 1,
    ...overrides,
  };
}

export function buildSubmissionErrorResponse(
  overrides: Partial<SubmissionResponseError> = {},
): SubmissionResponseError {
  return {
    errors: [
      {
        field: 'payload.topicSlugs',
        message: 'Unknown topic slugs: unknown-topic',
      },
    ],
    ...overrides,
  };
}
