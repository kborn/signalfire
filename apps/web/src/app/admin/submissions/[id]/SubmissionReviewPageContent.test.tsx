import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ModerationSubmissionDetail } from '@signal-fire/api-contracts';
import SubmissionReviewPageContent from '@/app/admin/submissions/[id]/SubmissionReviewPageContent';
import { postSubmissionReviewReq } from '@/lib/api/admin';
import { within } from '@testing-library/react';

const topics = {
  items: [
    {
      id: 1,
      slug: 'climate',
      name: 'Climate',
      description: 'Climate policy and environmental action.',
    },
    {
      id: 2,
      slug: 'democracy',
      name: 'Democracy',
      description: 'Voting rights and democratic institutions.',
    },
  ],
};

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;
type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

type ArticleSubmissionOverrides = Partial<Omit<ArticleModerationSubmission, 'submittedContent'>> & {
  submittedContent?: Partial<ArticleModerationSubmission['submittedContent']>;
};
type EventSubmissionOverrides = Partial<Omit<EventModerationSubmission, 'submittedContent'>> & {
  submittedContent?: Partial<EventModerationSubmission['submittedContent']>;
};

function createPendingArticleSubmission(
  overrides: ArticleSubmissionOverrides = {},
): ArticleModerationSubmission {
  const submittedContent: ArticleModerationSubmission['submittedContent'] = {
    title: 'Climate Basics',
    summary: 'A short climate policy overview.',
    content: 'Submitted article content ready for editorial review.',
    author: 'Jane Author',
    topics: [topics.items[0]],
    resourceLinks: ['https://example.org/source'],
    ...overrides.submittedContent,
  };

  return {
    id: 3,
    submissionType: 'ARTICLE',
    status: 'PENDING',
    submittedAt: '2026-05-20T14:00:00.000Z',
    submitterName: 'Sam Submitter',
    submitterEmail: 'sam@example.org',
    reviewedAt: null,
    reviewNotes: null,
    createdRecord: null,
    ...overrides,
    submittedContent,
  };
}

function createPendingEventSubmission(
  overrides: EventSubmissionOverrides = {},
): EventModerationSubmission {
  const submittedContent: EventModerationSubmission['submittedContent'] = {
    title: 'City Hall Transit Accountability Rally',
    summary: 'Residents call for reliable transit service.',
    description: 'A public rally supporting accountable and accessible transit.',
    eventType: 'RALLY',
    startTime: '2026-06-11T21:00:00.000Z',
    endTime: '2026-06-11T23:00:00.000Z',
    locationName: 'City Hall Plaza',
    publicLocationDescription: 'Meet by the north entrance.',
    addressLine1: '1400 John F Kennedy Blvd',
    addressLine2: null,
    city: 'Philadelphia',
    region: 'PA',
    country: 'US',
    postalCode: '19107',
    website: 'https://example.org/transit-rally',
    contactEmail: 'organizer@example.org',
    topics: [topics.items[0]],
    ...overrides.submittedContent,
  };

  return {
    id: 5,
    submissionType: 'EVENT',
    status: 'PENDING',
    submittedAt: '2026-05-20T16:00:00.000Z',
    submitterName: 'Taylor Organizer',
    submitterEmail: 'taylor@example.org',
    reviewedAt: null,
    reviewNotes: null,
    createdRecord: null,
    ...overrides,
    submittedContent,
  };
}

vi.mock('@/lib/api/admin', () => ({
  postSubmissionReviewReq: vi.fn(),
}));

describe('ArticleSubmissionForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('Article publish approval normalizes and renders success', async () => {
    vi.mocked(postSubmissionReviewReq).mockResolvedValue({
      submissionId: 3,
      status: 'APPROVED',
      reviewedAt: '2026-05-25T09:00:00.000Z',
      createdRecord: {
        recordType: 'ARTICLE',
        id: 4,
        title: 'How Local Climate Policy Works',
        slug: 'how-local-climate-policy-works',
        publishStatus: 'PUBLISHED',
      },
    });
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), '  How Local Climate Policy Works  ');

    await user.clear(screen.getByLabelText('Author'));
    await user.type(screen.getByLabelText('Internal notes'), 'Ready to publish.');

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'APPROVE_ARTICLE',
        publishStatus: 'PUBLISHED',
        reviewNotes: 'Ready to publish.',
        normalized: expect.objectContaining({
          title: 'How Local Climate Policy Works',
          author: 'anonymous',
        }),
      }),
      3,
    );
    expect(await screen.findByText('Review recorded')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View live page' })).toHaveAttribute(
      'href',
      '/articles/how-local-climate-policy-works',
    );

    const reviewOutcome = screen
      .getByRole('heading', { name: 'Review outcome' })
      .closest('section');

    expect(reviewOutcome).not.toBeNull();
    expect(within(reviewOutcome!).getByText('How Local Climate Policy Works')).toBeInTheDocument();
  });

  it('Event draft approval normalizes and renders success', async () => {
    vi.mocked(postSubmissionReviewReq).mockResolvedValue({
      submissionId: 3,
      status: 'APPROVED',
      reviewedAt: '2026-05-25T09:00:00.000Z',
      createdRecord: {
        recordType: 'EVENT',
        id: 4,
        title: 'City Hall Transit Accountability Rally',
        publishStatus: 'DRAFT',
      },
    });
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent
        submission={createPendingEventSubmission({
          submittedContent: { publicLocationDescription: null, website: '' },
        })}
        topics={topics}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve as Draft' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'APPROVE_EVENT',
        publishStatus: 'DRAFT',
        normalized: expect.objectContaining({
          title: 'City Hall Transit Accountability Rally',
          publicLocationDescription: null,
          website: null,
          startTime: '2026-06-11T21:00:00.000Z',
          endTime: '2026-06-11T23:00:00.000Z',
          city: 'Philadelphia',
          region: 'PA',
          country: 'US',
          postalCode: '19107',
          contactEmail: 'organizer@example.org',
        }),
      }),
      5,
    );
    expect(await screen.findByText('Review recorded')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open in admin' })).toHaveAttribute(
      'href',
      '/admin/events/4',
    );

    const reviewOutcome = screen
      .getByRole('heading', { name: 'Review outcome' })
      .closest('section');

    expect(reviewOutcome).not.toBeNull();
    expect(
      within(reviewOutcome!).getByText('City Hall Transit Accountability Rally'),
    ).toBeInTheDocument();
  });
});
