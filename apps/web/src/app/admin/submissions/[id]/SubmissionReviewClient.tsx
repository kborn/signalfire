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
} from '@signal-fire/api-contracts';

import EventNormalizationForm from '@/app/admin/submissions/[id]/EventNormalizedForm';
import { postSubmissionReviewReq } from '@/lib/api/admin';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

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

  function approve(entityStatus: EntityStatus) {
    console.log('Calling approve');
    console.log(articleNormalized);
    console.log(eventNormalized);
    if (submission.submissionType === 'ARTICLE') {
      if (!articleNormalized) return;
      const req: ModerationReviewApproveArticleRequest = {
        decision: 'APPROVE_ARTICLE',
        reviewNotes: reviewNotes,
        publishStatus: entityStatus,
        normalized: articleNormalized,
      };
      postSubmissionReviewReq(req, submission.id);
    } else {
      console.log('not yet');
    }
  }

  function reject() {
    console.log('Calling reject');
  }
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
          <button type="button" onClick={() => approve('PUBLISHED')} disabled={false}>
            Approve and Publish
          </button>
          <button type="submit" onClick={() => approve('DRAFT')} disabled={false}>
            Approve as Draft
          </button>
          <button type="submit" onClick={() => reject()} disabled={false}>
            Reject
          </button>
        </div>
      </section>
    </div>
  );
}
