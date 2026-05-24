'use client';
import { useState } from 'react';
import SubmittedContentPanel from './_components/SubmittedContentPanel';
import SubmissionMetadataPanel from './_components/SubmissionMetadataPanel';
import SubmissionReviewHeader from './_components/SubmissionReviewHeader';
import SubmissionReviewBadgeBar from './_components/SubmissionReviewBadgeBar';
import ArticleNormalizationForm from './_components/ArticleNormalizedForm';
import EventNormalizationForm from './_components/EventNormalizedForm';

import type {
  ArticleApprovalPayload,
  EventApprovalPayload,
  ModerationSubmissionDetail,
  TopicListResponse,
  EntityStatus,
  ModerationReviewApproveArticleRequest,
  ModerationReviewApproveEventRequest,
  ModerationReviewSuccess,
} from '@signal-fire/api-contracts';

import { postSubmissionReviewReq } from '@/lib/api/admin';
import { SubmissionError } from '@/lib/api/error';
import {
  mapSubmissionApiFieldToUiField,
  SUBMISSION_FIELD_LIMITS,
  validateRequiredString,
} from '@/lib/submission-form-validation';

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

export type ArticleSubmissionFormErrors = {
  title?: string;
  summary?: string;
  content?: string;
  topicSlugs?: string;
  resourceLinks?: string;
  author?: string;
  submitterName?: string;
  submitterEmail?: string;
};

function mapApiFieldToUiField(field: string): string | null {
  const sharedField = mapSubmissionApiFieldToUiField(field);
  if (sharedField) {
    return sharedField;
  }

  switch (field) {
    case 'normalized.title':
      return 'title';
    case 'normalized.summary':
      return 'summary';
    case 'normalized.content':
      return 'content';
    case 'normalized.topicSlugs':
      return 'topicSlugs';
    case 'normalized.resourceLinks':
      return 'resourceLinks';
    case 'submitterName':
      return 'submitterName';
    case 'submitterEmail':
      return 'submitterEmail';
    case 'author':
      return 'author';
    default:
      return null;
  }
}

export default function SubmissionReviewPageContent({
  submission,
  topics,
}: {
  submission: ModerationSubmissionDetail;
  topics: TopicListResponse;
}) {
  async function approve(entityStatus: EntityStatus) {
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    const errors: ArticleSubmissionFormErrors = {};
    const titleError = validateRequiredString(
      articleNormalized ? articleNormalized.title : '',
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    console.log(`title error ${titleError}`);
    if (titleError) {
      errors.title = titleError;
    }

    setErrors(errors);

    if (Object.keys(errors).length == 0) {
      try {
        if (submission.submissionType === 'ARTICLE') {
          if (!articleNormalized) {
            // TODO set error
            return;
          }
          const req: ModerationReviewApproveArticleRequest = {
            decision: 'APPROVE_ARTICLE',
            reviewNotes: reviewNotes,
            publishStatus: entityStatus,
            normalized: articleNormalized,
          };
          const rep = await postSubmissionReviewReq(req, submission.id);
          setReviewResult(rep);
        } else {
          if (!eventNormalized) {
            // TODO set error
            return;
          }
          const fixed = {
            ...eventNormalized,
            // TODO validate this
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
          const rep: ModerationReviewSuccess = await postSubmissionReviewReq(req, submission.id);
          setReviewResult(rep);
        }
        setIsSuccess(true);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      } catch (error) {
        if (error instanceof SubmissionError) {
          if (error.errors) {
            const newEntries = error.errors.reduce((acc, e) => {
              const uiField = mapApiFieldToUiField(e.field);
              if (!uiField) {
                return acc;
              }
              return {
                ...acc,
                [uiField]: e.message,
              };
            }, {});

            if (Object.keys(newEntries).length > 0) {
              setErrors((prev) => ({ ...prev, ...newEntries }));
            } else {
              setSubmitError(
                'Something went wrong while sending your submission. Please try again.',
              );
            }
          } else {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  async function reject() {
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    try {
      const rep = await postSubmissionReviewReq(
        { decision: 'REJECT', reviewNotes: reviewNotes },
        submission.id,
      );
      setIsSuccess(true);
      setReviewResult(rep);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      if (error instanceof SubmissionError) {
        if (error.errors) {
          const newEntries = error.errors.reduce((acc, e) => {
            const uiField = mapApiFieldToUiField(e.field);
            if (!uiField) {
              return acc;
            }
            return {
              ...acc,
              [uiField]: e.message,
            };
          }, {});

          if (Object.keys(newEntries).length > 0) {
            setErrors((prev) => ({ ...prev, ...newEntries }));
          } else {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } else {
        setSubmitError('Something went wrong while sending your submission. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(submission.reviewNotes ?? '');
  const [articleNormalized, setArticleNormalized] = useState<ArticleApprovalPayload | null>(null);
  const [eventNormalized, setEventNormalized] = useState<EventApprovalPayload | null>(null);
  const [reviewResult, setReviewResult] = useState<ModerationReviewSuccess | null>(null);
  const [errors, setErrors] = useState<ArticleSubmissionFormErrors>({});
  const visibleSubmission: ModerationSubmissionDetail = {
    ...submission,
    status: reviewResult?.status ?? submission.status,
    reviewedAt: reviewResult?.reviewedAt ?? submission.reviewedAt,
  };

  return (
    <section className="page-section">
      <SubmissionReviewHeader />
      <SubmissionReviewBadgeBar submission={visibleSubmission} />
      {isSuccess && (
        <div className="adminReviewBanner" role="status">
          <p className="adminReviewBannerTitle">Review recorded</p>
          <p className="adminReviewBannerText">This moderation decision was saved successfully.</p>
        </div>
      )}
      {submitError && (
        <div className="adminReviewBannerError" role="status">
          <p className="adminReviewBannerTitle">Unexpected review failure</p>
          <p className="adminReviewBannerText">{submitError}.</p>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="adminReviewBannerError" role="status">
          <p className="adminReviewBannerTitle">Review could not be recorded</p>
          <p className="adminReviewBannerText">Fix the highlighted fields and try again.</p>
        </div>
      )}
      <SubmissionMetadataPanel submission={visibleSubmission} />
      <div className="adminReviewMain">
        <SubmittedContentPanel submission={visibleSubmission} />
      </div>
      {submission.status === 'PENDING' && (
        <div className="adminReviewMain">
          <section className="adminPanel" aria-labelledby="editorial-normalization-heading">
            <div className="adminPanelHeader">
              <h2 id="editorial-normalization-heading">Editorial normalization</h2>
            </div>
            {submission.submissionType === 'ARTICLE' ? (
              <ArticleNormalizationForm
                submission={submission}
                topics={topics.items}
                success={isSuccess ?? false}
                errors={errors}
                onChange={setArticleNormalized}
              />
            ) : (
              <EventNormalizationForm
                submission={submission}
                topics={topics.items}
                success={isSuccess ?? false}
                onChange={setEventNormalized}
              />
            )}
          </section>
        </div>
      )}
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
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          disabled={(isSuccess ?? false) || submission.status !== 'PENDING'}
        />
      </section>
      {submission.status === 'PENDING' && (
        <div className="adminReviewMain">
          <section className="adminPanel" aria-labelledby="decision-actions-heading">
            <div className="adminPanelHeader">
              <h2 id="decision-actions-heading">Decision actions</h2>
            </div>
            <div className="adminFilterGroup" aria-label="Moderation actions">
              <button
                type="button"
                onClick={() => approve('PUBLISHED')}
                disabled={isSubmitting || visibleSubmission.status !== 'PENDING'}
              >
                Approve and Publish
              </button>
              <button
                type="submit"
                onClick={() => approve('DRAFT')}
                disabled={isSubmitting || visibleSubmission.status !== 'PENDING'}
              >
                Approve as Draft
              </button>
              <button
                type="submit"
                onClick={() => reject()}
                disabled={isSubmitting || visibleSubmission.status !== 'PENDING'}
              >
                Reject
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
