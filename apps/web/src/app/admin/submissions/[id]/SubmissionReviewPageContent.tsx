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
import { SUBMISSION_FIELD_LIMITS, validateRequiredString } from '@/lib/submission-form-validation';

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

export type ReviewFormErrors = {
  form?: string;

  // Article + shared fields
  title?: string;
  summary?: string;
  content?: string;
  author?: string;
  topicSlugs?: string;

  // Event fields
  description?: string;
  eventType?: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  publicLocationDescription?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  contactEmail?: string;

  // Review metadata
  reviewNotes?: string;
};

function mapApiFieldToUiField(field: string | undefined): keyof ReviewFormErrors {
  switch (field) {
    case 'normalized.title':
      return 'title';
    case 'normalized.summary':
      return 'summary';
    case 'normalized.content':
      return 'content';
    case 'normalized.author':
      return 'author';
    case 'normalized.topicSlugs':
    case 'normalized.topicSlugs[0]':
      return 'topicSlugs';

    case 'normalized.description':
      return 'description';
    case 'normalized.eventType':
      return 'eventType';
    case 'normalized.startTime':
      return 'startTime';
    case 'normalized.endTime':
      return 'endTime';
    case 'normalized.locationName':
      return 'locationName';
    case 'normalized.publicLocationDescription':
      return 'publicLocationDescription';
    case 'normalized.addressLine1':
      return 'addressLine1';
    case 'normalized.addressLine2':
      return 'addressLine2';
    case 'normalized.city':
      return 'city';
    case 'normalized.region':
      return 'region';
    case 'normalized.country':
      return 'country';
    case 'normalized.postalCode':
      return 'postalCode';
    case 'normalized.website':
      return 'website';
    case 'normalized.contactEmail':
      return 'contactEmail';

    case 'reviewNotes':
      return 'reviewNotes';

    default:
      return 'form';
  }
}

export default function SubmissionReviewPageContent({
  submission,
  topics,
}: {
  submission: ModerationSubmissionDetail;
  topics: TopicListResponse;
}) {
  type ValidationResult<TPayload> =
    | { ok: true; payload: TPayload }
    | { ok: false; errors: ReviewFormErrors };

  function validateArticleApproval(
    payload: ArticleApprovalPayload | null,
    entityStatus: EntityStatus,
  ): ValidationResult<ModerationReviewApproveArticleRequest> {
    const errors: ReviewFormErrors = {};
    if (!payload) {
      return { ok: false, errors: { form: 'Article approval fields are not ready yet.' } };
    }
    const titleError = validateRequiredString(
      payload ? payload.title : '',
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      errors.title = titleError;
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors: errors };
    }
    const req: ModerationReviewApproveArticleRequest = {
      decision: 'APPROVE_ARTICLE',
      reviewNotes: reviewNotes,
      publishStatus: entityStatus,
      normalized: payload,
    };
    return { ok: true, payload: req };
  }

  function validateEventApproval(
    payload: EventApprovalPayload | null,
    entityStatus: EntityStatus,
  ): ValidationResult<ModerationReviewApproveEventRequest> {
    const errors: ReviewFormErrors = {};
    if (!payload) {
      return { ok: false, errors: { form: 'Event approval fields are not ready yet.' } };
    }

    const fixed = {
      ...payload,
      // TODO validate this
      startTime: parseLocalDateTime(payload.startTime)!.toISOString(),
      endTime: payload.endTime ? parseLocalDateTime(payload.endTime)!.toISOString() : null,
    };

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors: errors };
    }
    const req: ModerationReviewApproveEventRequest = {
      decision: 'APPROVE_EVENT',
      reviewNotes: reviewNotes,
      publishStatus: entityStatus,
      normalized: fixed,
    };
    return { ok: true, payload: req };
  }

  async function approve(entityStatus: EntityStatus) {
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    const validation =
      submission.submissionType === 'ARTICLE'
        ? validateArticleApproval(articleNormalized, entityStatus)
        : validateEventApproval(eventNormalized, entityStatus);

    console.log(validation);
    if (!validation.ok) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const rep = await postSubmissionReviewReq(validation.payload, submission.id);
      setReviewResult(rep);
      setIsSuccess(true);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      if (error instanceof SubmissionError) {
        if (error.errors) {
          const newEntries = error.errors.reduce<ReviewFormErrors>((acc, e) => {
            const uiField = mapApiFieldToUiField(e.field);
            if (!uiField) {
              acc.form = e.message;
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
  const [errors, setErrors] = useState<ReviewFormErrors>({});
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
