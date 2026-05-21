import type {
  ArticleSubmissionRequest,
  EventSubmissionRequest,
  ModerationReviewApproveArticleRequest,
  ModerationReviewApproveEventRequest,
  ModerationReviewRejectRequest,
  ModerationReviewSuccess,
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
type ModerationReviewApproveArticleRequestOverrides = Partial<
  Omit<ModerationReviewApproveArticleRequest, 'normalized'>
> & {
  normalized?: Partial<ModerationReviewApproveArticleRequest['normalized']>;
};
type ModerationReviewApproveEventRequestOverrides = Partial<
  Omit<ModerationReviewApproveEventRequest, 'normalized'>
> & {
  normalized?: Partial<ModerationReviewApproveEventRequest['normalized']>;
};

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
      startTime: SUBMISSION_EVENT_START_DATE.toISOString(),
      endTime: SUBMISSION_EVENT_END_DATE.toISOString(),
      locationName: 'City Hall North Plaza',
      publicLocationDescription: 'Meet at the spot',
      locationAddressLine1: '1400 John F Kennedy Blvd',
      locationAddressLine2: 'Ste 1A',
      locationAddressCity: 'Philadelphia',
      locationAddressRegion: 'PA',
      locationAddressCountry: 'US',
      locationAddressZip: '19107',
      contactEmail: 'press@example.org',
      topicSlugs: ['economic-justice'],
      websiteUrl: 'https://example.org/event',
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

export function buildModerationReviewRejectRequest(
  overrides: Partial<ModerationReviewRejectRequest> = {},
): ModerationReviewRejectRequest {
  return {
    decision: 'REJECT',
    reviewNotes: 'Not a fit',
    ...overrides,
  };
}

export function buildModerationReviewApproveArticleRequest(
  overrides: ModerationReviewApproveArticleRequestOverrides = {},
): ModerationReviewApproveArticleRequest {
  const { normalized: normalizedOverrides, ...requestOverrides } = overrides;

  return {
    decision: 'APPROVE_ARTICLE',
    reviewNotes: 'Looks good',
    publishStatus: 'PUBLISHED',
    normalized: {
      title: 'How Local Organizing Works',
      summary: 'A practical explainer on local issue campaigns.',
      content: 'Published article content.',
      topicSlugs: ['local-community'],
      author: 'John Doe',
      ...(normalizedOverrides ?? {}),
    },
    ...requestOverrides,
  };
}

export function buildModerationReviewApproveEventRequest(
  overrides: ModerationReviewApproveEventRequestOverrides = {},
): ModerationReviewApproveEventRequest {
  const { normalized: normalizedOverrides, ...requestOverrides } = overrides;

  return {
    decision: 'APPROVE_EVENT',
    reviewNotes: 'Looks good',
    publishStatus: 'PUBLISHED',
    normalized: {
      title: 'Tenant Rights Rally',
      summary: 'Public rally supporting stronger tenant protections.',
      description: 'Join local organizers for a rally and speaker program.',
      eventType: 'RALLY',
      startTime: SUBMISSION_EVENT_START_DATE.toISOString(),
      endTime: SUBMISSION_EVENT_END_DATE.toISOString(),
      locationName: 'City Hall North Plaza',
      publicLocationDescription: 'Meet at the spot',
      addressLine1: '1400 John F Kennedy Blvd',
      addressLine2: 'Ste 1A',
      city: 'Philadelphia',
      region: 'PA',
      country: 'US',
      postalCode: '19107',
      contactEmail: 'me@event.com',
      website: 'https://example.org/event',
      topicSlugs: ['economic-justice'],
      ...(normalizedOverrides ?? {}),
    },
    ...requestOverrides,
  };
}

export function buildModerationReviewRejectSuccessResponse(
  overrides: Partial<ModerationReviewSuccess> = {},
): ModerationReviewSuccess {
  return {
    submissionId: 1,
    status: 'REJECTED',
    reviewedAt: SUBMISSION_TEST_DATE.toISOString(),
    ...overrides,
  };
}

export function buildModerationReviewApproveArticleSuccessResponse(
  overrides: Partial<ModerationReviewSuccess> = {},
): ModerationReviewSuccess {
  return {
    submissionId: 1,
    status: 'APPROVED',
    reviewedAt: SUBMISSION_TEST_DATE.toISOString(),
    createdRecord: {
      recordType: 'ARTICLE',
      id: 10,
      slug: 'how-local-organizing-works',
      publishStatus: 'PUBLISHED',
    },
    ...overrides,
  };
}

export function buildModerationReviewApproveEventSuccessResponse(
  overrides: Partial<ModerationReviewSuccess> = {},
): ModerationReviewSuccess {
  return {
    submissionId: 1,
    status: 'APPROVED',
    reviewedAt: SUBMISSION_TEST_DATE.toISOString(),
    createdRecord: {
      recordType: 'EVENT',
      id: 20,
      publishStatus: 'PUBLISHED',
    },
    ...overrides,
  };
}
