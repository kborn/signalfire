import { cleanup, render, screen } from '@testing-library/react';
import type { ModerationSubmissionDetail } from '@signal-fire/api-contracts';
import { afterEach, describe, expect, it } from 'vitest';

import ReviewOutcomePanel from './ReviewOutcomePanel';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;
type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

function createReviewedArticle(
  createdRecord: ArticleModerationSubmission['createdRecord'],
): ArticleModerationSubmission {
  return {
    id: 5,
    submissionType: 'ARTICLE',
    status: 'APPROVED',
    submittedAt: '2026-05-20T14:00:00.000Z',
    submitterName: 'Sam Submitter',
    submitterEmail: 'sam@example.org',
    reviewedAt: '2026-05-25T09:00:00.000Z',
    reviewNotes: 'Ready to publish.',
    createdRecord,
    submittedContent: {
      title: 'Climate Basics',
      summary: 'A short climate policy overview.',
      content: 'Submitted article content ready for editorial review.',
      author: 'Jane Author',
      topics: [],
      resourceLinks: [],
    },
  };
}

function createReviewedEvent(
  createdRecord: EventModerationSubmission['createdRecord'],
): EventModerationSubmission {
  return {
    id: 6,
    submissionType: 'EVENT',
    status: 'APPROVED',
    submittedAt: '2026-05-20T16:00:00.000Z',
    submitterName: 'Taylor Organizer',
    submitterEmail: 'taylor@example.org',
    reviewedAt: '2026-05-25T09:00:00.000Z',
    reviewNotes: 'Ready to publish.',
    createdRecord,
    submittedContent: {
      title: 'Transit Rally',
      summary: 'Residents call for reliable transit service.',
      description: 'A public rally supporting accountable and accessible transit.',
      eventType: 'RALLY',
      startTime: '2026-06-11T21:00:00.000Z',
      endTime: null,
      locationName: 'City Hall Plaza',
      publicLocationDescription: null,
      addressLine1: null,
      addressLine2: null,
      city: 'Philadelphia',
      region: 'PA',
      country: 'US',
      postalCode: '19107',
      website: null,
      contactEmail: null,
      topics: [],
    },
  };
}

describe('ReviewOutcomePanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('links a published article created record to its public page', () => {
    render(
      <ReviewOutcomePanel
        submission={createReviewedArticle({
          recordType: 'ARTICLE',
          id: 10,
          title: 'Climate Basics',
          slug: 'climate-basics',
          publishStatus: 'PUBLISHED',
        })}
      />,
    );

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View live page' })).toHaveAttribute(
      'href',
      '/articles/climate-basics',
    );
  });

  it('links a published event created record to its public page', () => {
    render(
      <ReviewOutcomePanel
        submission={createReviewedEvent({
          recordType: 'EVENT',
          id: 20,
          title: 'Transit Rally',
          publishStatus: 'PUBLISHED',
        })}
      />,
    );

    expect(screen.getByRole('link', { name: 'View live page' })).toHaveAttribute(
      'href',
      '/events/20',
    );
  });

  it('links a draft article created record to its admin route', () => {
    render(
      <ReviewOutcomePanel
        submission={createReviewedArticle({
          recordType: 'ARTICLE',
          id: 10,
          title: 'Climate Basics',
          slug: 'climate-basics',
          publishStatus: 'DRAFT',
        })}
      />,
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open in admin' })).toHaveAttribute(
      'href',
      '/admin/articles/climate-basics',
    );
  });

  it('links a draft event created record to its admin route', () => {
    render(
      <ReviewOutcomePanel
        submission={createReviewedEvent({
          recordType: 'EVENT',
          id: 20,
          title: 'Transit Rally',
          publishStatus: 'DRAFT',
        })}
      />,
    );

    expect(screen.getByRole('link', { name: 'Open in admin' })).toHaveAttribute(
      'href',
      '/admin/events/20',
    );
  });

  it('does not render a created record for a rejected submission', () => {
    render(
      <ReviewOutcomePanel
        submission={{
          ...createReviewedArticle(null),
          status: 'REJECTED',
          reviewNotes: 'Not suitable for publication.',
        }}
      />,
    );

    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.queryByText('Created article')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
