'use client';
import { useState } from 'react';

import ArticleNormalizationForm from '@/app/admin/submissions/[id]/ArticleNormalizedForm';
import type {
  ArticleApprovalPayload,
  EventApprovalPayload,
  ModerationSubmissionDetail,
  TopicSummary,
  EntityStatus,
  ModerationReviewApproveArticleRequest,
  ModerationReviewApproveEventRequest,
} from '@signal-fire/api-contracts';

import EventNormalizationForm from '@/app/admin/submissions/[id]/EventNormalizedForm';
import { postSubmissionReviewReq } from '@/lib/api/admin';

function parseLocalDateTime(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export default function SubmissionReviewClient({
  submission,
  topics,
}: {
  submission: ModerationSubmissionDetail;
  topics: TopicSummary[];
}) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [articleNormalized, setArticleNormalized] = useState<ArticleApprovalPayload | null>(null);
  const [eventNormalized, setEventNormalized] = useState<EventApprovalPayload | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function approve(entityStatus: EntityStatus) {
    setIsSubmitting(true);
    try {
      if (submission.submissionType === 'ARTICLE') {
        if (!articleNormalized) return;
        const req: ModerationReviewApproveArticleRequest = {
          decision: 'APPROVE_ARTICLE',
          reviewNotes: reviewNotes,
          publishStatus: entityStatus,
          normalized: articleNormalized,
        };
        const rep = await postSubmissionReviewReq(req, submission.id);
      } else {
        if (!eventNormalized) return;
        const fixed = {
          ...eventNormalized,
          startTime: parseLocalDateTime(eventNormalized.startTime)!.toISOString(),
          endTime: eventNormalized.endTime
            ? parseLocalDateTime(eventNormalized.endTime)!.toISOString()
            : null,
        };
        const req: ModerationReviewApproveEventRequest = {
          decision: 'APPROVE_EVENT',
          reviewNotes: reviewNotes,
          publishStatus: entityStatus,
          normalized: fixed,
        };
        const rep = await postSubmissionReviewReq(req, submission.id);
      }
      setIsSuccess(true);
    } catch (error) {
      console.log('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function reject() {
    setIsSubmitting(true);
    try {
      const rep = await postSubmissionReviewReq(
        { decision: 'REJECT', reviewNotes: reviewNotes },
        submission.id,
      );
      setIsSuccess(true);
    } catch (error) {
      console.log('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={'submissionSuccess'}>
        <p className="section-label">Review submitted</p>
        <h1 className="pageTitle">Thanks for submitting a review</h1>
        <p className="page-intro">Thanks — your submission review has been posted.</p>
      </div>
    );
  } else {
    return (
      <div>
        <section className="adminPanel" aria-labelledby="editorial-normalization-heading">
          <div className="adminPanelHeader">
            <h2 id="editorial-normalization-heading">Editorial normalization</h2>
          </div>
          {submission.submissionType === 'ARTICLE' ? (
            <ArticleNormalizationForm
              submission={submission}
              topics={topics}
              onChange={setArticleNormalized}
            />
          ) : (
            <EventNormalizationForm
              submission={submission}
              topics={topics}
              onChange={setEventNormalized}
            />
          )}
        </section>
        <section className="adminPanel" aria-labelledby="review-notes-heading">
          <div className="adminPanelHeader">
            <h2 id="review-notes-heading">Review notes</h2>
          </div>
          <label htmlFor="review-notes">Internal notes</label>
          <textarea
            id="review-notes"
            className="submissionTextarea"
            rows={5}
            aria-describedby="review-notes-helper"
            onChange={(event) => setReviewNotes(event.target.value)}
          />
        </section>
        <section className="adminPanel" aria-labelledby="decision-actions-heading">
          <div className="adminPanelHeader">
            <h2 id="decision-actions-heading">Decision actions</h2>
          </div>
          <div className="adminFilterGroup" aria-label="Moderation actions">
            <button type="button" onClick={() => approve('PUBLISHED')} disabled={isSubmitting}>
              Approve and Publish
            </button>
            <button type="submit" onClick={() => approve('DRAFT')} disabled={isSubmitting}>
              Approve as Draft
            </button>
            <button type="submit" onClick={() => reject()} disabled={isSubmitting}>
              Reject
            </button>
          </div>
        </section>
      </div>
    );
  }
}
