import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ModerationSubmissionDetail } from '@signal-fire/api-contracts';
import SubmissionReviewPageContent from '@/app/admin/(workspace)/submissions/[id]/SubmissionReviewPageContent';
import { postSubmissionReviewReq } from '@/lib/api/admin';
import { SubmissionError } from '@/lib/api/error';

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

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
    id: 5,
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

const scrollIntoView = vi.fn();

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
});

function getReviewOutcomePanel() {
  const panel = screen.getByRole('heading', { name: 'Review outcome' }).closest('section');

  expect(panel).not.toBeNull();

  return panel!;
}

describe('SubmissionReviewPageContent', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('Article publish approval normalizes and renders success', async () => {
    vi.mocked(postSubmissionReviewReq).mockResolvedValue({
      submissionId: 5,
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
      5,
    );
    expect(await screen.findByText('Review recorded')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View live page' })).toHaveAttribute(
      'href',
      '/articles/how-local-climate-policy-works',
    );

    expect(
      within(getReviewOutcomePanel()).getByText('How Local Climate Policy Works'),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Approve and Publish' })).toBeDisabled();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('Event draft approval normalizes and renders success', async () => {
    vi.mocked(postSubmissionReviewReq).mockResolvedValue({
      submissionId: 5,
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
          submittedContent: {
            publicLocationDescription: null,
            addressLine2: '   ',
            website: '',
            contactEmail: '   ',
          },
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
          addressLine2: null,
          website: null,
          startTime: '2026-06-11T21:00:00.000Z',
          endTime: '2026-06-11T23:00:00.000Z',
          city: 'Philadelphia',
          region: 'PA',
          country: 'US',
          postalCode: '19107',
          contactEmail: null,
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

    expect(
      within(getReviewOutcomePanel()).getByText('City Hall Transit Accountability Rally'),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Approve as Draft' })).toBeDisabled();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('Rejection sends notes and renders a rejected outcome', async () => {
    vi.mocked(postSubmissionReviewReq).mockResolvedValue({
      submissionId: 5,
      status: 'REJECTED',
      reviewedAt: '2026-05-25T09:00:00.000Z',
    });
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.type(screen.getByLabelText('Internal notes'), 'Insufficiently cited.');

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(postSubmissionReviewReq).not.toHaveBeenCalled();
    expect(screen.getByText(/Rejecting a submission is final/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm Reject' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      {
        decision: 'REJECT',
        reviewNotes: 'Insufficiently cited.',
      },
      5,
    );
    expect(await screen.findByText('Review recorded')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.queryByText('Created article')).not.toBeInTheDocument();
    expect(screen.queryByText('Created event')).not.toBeInTheDocument();

    expect(screen.getByLabelText('Internal notes')).toBeDisabled();
    expect(screen.getByLabelText('Title')).toBeDisabled();

    expect(within(getReviewOutcomePanel()).getByText('Insufficiently cited.')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Reject' })).toBeDisabled();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('blocks article approval when required normalized fields are invalid', async () => {
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.clear(screen.getByLabelText('Title'));
    await user.click(screen.getByRole('checkbox', { name: 'Climate' }));

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Select at least one related topic')).toBeInTheDocument();
    expect(screen.getByText('Review could not be recorded')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Title')).toHaveAttribute(
      'aria-describedby',
      'normalized-title-error',
    );

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('blocks event approval when event-specific normalized fields are invalid', async () => {
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingEventSubmission()} topics={topics} />,
    );

    await user.clear(screen.getByLabelText('ZIP Code'));
    await user.clear(screen.getByLabelText('End date and time (optional)'));
    await user.type(screen.getByLabelText('End date and time (optional)'), '2026-06-11T16:00');

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).not.toHaveBeenCalled();
    expect(screen.getByText('ZIP Code is required')).toBeInTheDocument();
    expect(
      screen.getByText('End date and time must be after the start date and time'),
    ).toBeInTheDocument();
    expect(screen.getByText('Review could not be recorded')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('maps article API validation errors to inline review fields', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 400, 'submissions', [
        { type: 'field', field: 'normalized.title', message: 'Title is required' },
        { type: 'field', field: 'reviewNotes', message: 'Review notes are too long' },
      ]),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'APPROVE_ARTICLE',
        publishStatus: 'PUBLISHED',
      }),
      5,
    );

    expect(await screen.findByText('Review could not be recorded')).toBeInTheDocument();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Review notes are too long')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('maps event API validation errors to inline review fields', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 400, 'submissions', [
        { type: 'field', field: 'normalized.postalCode', message: 'Postal code is required' },
        { type: 'field', field: 'normalized.contactEmail', message: 'Email must be valid' },
      ]),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingEventSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'APPROVE_EVENT',
        publishStatus: 'PUBLISHED',
      }),
      5,
    );

    expect(await screen.findByText('Review could not be recorded')).toBeInTheDocument();
    expect(screen.getByText('Postal code is required')).toBeInTheDocument();
    expect(screen.getByText('Email must be valid')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('renders review-notes validation returned from a rejection request', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 400, 'submissions', [
        { type: 'field', field: 'reviewNotes', message: 'Review notes are too long' },
      ]),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Reject' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      {
        decision: 'REJECT',
        reviewNotes: '',
      },
      5,
    );
    expect(await screen.findByText('Review could not be recorded')).toBeInTheDocument();
    expect(screen.getByText('Review notes are too long')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('renders form-level validation errors when API errors omit field names', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 400, 'submissions', [
        { type: 'form', message: 'Submission has already been reviewed.' },
      ]),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(await screen.findByText('Review could not be recorded')).toBeInTheDocument();
    expect(screen.getByText('Submission has already been reviewed.')).toBeInTheDocument();
  });

  it('renders not-found message for 404 review responses', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 404, 'submissions', null),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(await screen.findByText('Unexpected review failure')).toBeInTheDocument();
    expect(
      screen.getByText('This submission is no longer available. Return to the queue and refresh.'),
    ).toBeInTheDocument();
  });

  it('renders conflict message for 409 review responses', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(
      new SubmissionError(`Request failed for submissions`, 409, 'submissions', null),
    );
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(await screen.findByText('Unexpected review failure')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This submission has already been reviewed. Refresh to see the latest state.',
      ),
    ).toBeInTheDocument();
  });

  it('preserves editable state after a non-validation API failure', async () => {
    vi.mocked(postSubmissionReviewReq).mockRejectedValue(new Error('failed'));
    const user = userEvent.setup();
    render(
      <SubmissionReviewPageContent submission={createPendingArticleSubmission()} topics={topics} />,
    );

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'How Local Climate Policy Works');

    await user.type(screen.getByLabelText('Internal notes'), 'Ready to publish.');

    await user.click(screen.getByRole('button', { name: 'Approve and Publish' }));

    expect(postSubmissionReviewReq).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'APPROVE_ARTICLE',
        publishStatus: 'PUBLISHED',
        reviewNotes: 'Ready to publish.',
        normalized: expect.objectContaining({
          title: 'How Local Climate Policy Works',
        }),
      }),
      5,
    );
    expect(await screen.findByText('Unexpected review failure')).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong while sending your submission. Please try again.'),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Title')).toHaveValue('How Local Climate Policy Works');
    expect(screen.getByLabelText('Internal notes')).toHaveValue('Ready to publish.');
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    expect(screen.getByRole('button', { name: 'Approve and Publish' })).toBeEnabled();
  });

  it('renders a persisted approved submission without editable review actions', () => {
    render(
      <SubmissionReviewPageContent
        submission={createPendingArticleSubmission({
          status: 'APPROVED',
          reviewedAt: '2026-05-25T09:00:00.000Z',
          reviewNotes: 'Ready to publish.',
          createdRecord: {
            recordType: 'ARTICLE',
            id: 4,
            title: 'Climate Basics',
            slug: 'climate-basics',
            publishStatus: 'PUBLISHED',
          },
        })}
        topics={topics}
      />,
    );

    expect(within(getReviewOutcomePanel()).getByText('Ready to publish.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View live page' })).toHaveAttribute(
      'href',
      '/articles/climate-basics',
    );
    expect(screen.queryByText('Review recorded')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve and Publish' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Internal notes')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
  });

  it('renders a persisted rejected submission without editable review actions', () => {
    render(
      <SubmissionReviewPageContent
        submission={createPendingEventSubmission({
          status: 'REJECTED',
          reviewedAt: '2026-05-25T09:00:00.000Z',
          reviewNotes: 'Event information could not be verified.',
        })}
        topics={topics}
      />,
    );

    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(
      within(getReviewOutcomePanel()).getByText('Event information could not be verified.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Created article')).not.toBeInTheDocument();
    expect(screen.queryByText('Created event')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Internal notes')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
  });
});
