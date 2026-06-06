'use client';
import { useEffect, useState } from 'react';
import SubmittedContentPanel from './_components/SubmittedContentPanel';
import SubmissionMetadataPanel from './_components/SubmissionMetadataPanel';
import SubmissionReviewHeader from './_components/SubmissionReviewHeader';
import ReviewOutcomePanel from './_components/ReviewOutcomePanel';
import SubmissionReviewBadgeBar from './_components/SubmissionReviewBadgeBar';
import ArticleNormalizationForm from './_components/ArticleNormalizedForm';
import EventNormalizationForm from './_components/EventNormalizedForm';
import type { ReviewFormErrors } from './_components/review-form.types';

import {
  ArticleApprovalPayload,
  EventApprovalPayload,
  ModerationSubmissionDetail,
  TopicListResponse,
  EntityStatus,
  ModerationReviewSuccess,
  ModerationReviewRequest,
  EventType,
} from '@signal-fire/api-contracts';

import { postSubmissionReviewReq } from '@/lib/api/admin';
import { ApiError, SubmissionError } from '@/lib/api/error';
import {
  parseLocalDateTime,
  SUBMISSION_FIELD_LIMITS,
  validateOptionalEmail,
  validateOptionalStringMax,
  validateRequiredString,
} from '@/lib/submission-form-validation';

const REVIEW_FAILURE_MESSAGE =
  'Something went wrong while sending your submission. Please try again.';
const REVIEW_NOT_FOUND_MESSAGE =
  'This submission is no longer available. Return to the queue and refresh.';
const REVIEW_CONFLICT_MESSAGE =
  'This submission has already been reviewed. Refresh to see the latest state.';
const REVIEW_VALIDATION_MESSAGE = 'Fix the highlighted fields and try again.';

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

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: getScrollBehavior(),
  });
}

function getScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== 'function') {
    return 'smooth';
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function getControlElementId(field: keyof ReviewFormErrors): string {
  const specialControlIds: Partial<Record<keyof ReviewFormErrors, string>> = {
    eventType: 'normalized-eventType',
    startTime: 'normalized-event-start',
    endTime: 'normalized-event-end',
    locationName: 'normalized-location-name',
    publicLocationDescription: 'normalized-location-description',
    contactEmail: 'normalized-contact-email',
    topicSlugs: 'normalized-topic-group',
    reviewNotes: 'review-notes',
  };

  return specialControlIds[field] ?? `normalized-${field}`;
}

function scrollToFirstError(errors: ReviewFormErrors) {
  const fieldOrder: (keyof ReviewFormErrors)[] = [
    'title',
    'summary',
    'content',
    'author',
    'description',
    'eventType',
    'startTime',
    'endTime',
    'locationName',
    'publicLocationDescription',
    'addressLine1',
    'addressLine2',
    'city',
    'region',
    'country',
    'postalCode',
    'website',
    'contactEmail',
    'topicSlugs',
    'reviewNotes',
  ];

  const firstField = fieldOrder.find((field) => errors[field]);
  if (!firstField) {
    scrollToTop();
    return;
  }

  const id = getControlElementId(firstField);
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    scrollToTop();
    return;
  }

  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: getScrollBehavior(),
    block: 'center',
  });
}

function mapApiErrorsToReviewErrors(errors: SubmissionError['errors']): ReviewFormErrors {
  if (!errors?.length) {
    return {};
  }

  return errors.reduce<ReviewFormErrors>((acc, entry) => {
    if (entry.type === 'form') {
      return {
        ...acc,
        form: entry.message,
      };
    }

    const uiField = mapApiFieldToUiField(entry.field);

    return {
      ...acc,
      [uiField]: entry.message,
    };
  }, {});
}

function getReviewStatusMessage(error: unknown): string | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  if (error.status === 404) {
    return REVIEW_NOT_FOUND_MESSAGE;
  }

  if (error.status === 409) {
    return REVIEW_CONFLICT_MESSAGE;
  }

  return null;
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

  function handleReviewRequestError(error: unknown) {
    if (error instanceof SubmissionError) {
      const fieldErrors = mapApiErrorsToReviewErrors(error.errors);
      setErrors(fieldErrors);

      if (fieldErrors.form) {
        setSubmitError(fieldErrors.form);
      }

      if (Object.keys(fieldErrors).length > 0) {
        return;
      }
    }

    setSubmitError(getReviewStatusMessage(error) ?? REVIEW_FAILURE_MESSAGE);
    scrollToTop();
  }

  function buildArticleApprovalRequest(
    entityStatus: EntityStatus,
    payload: ArticleApprovalPayload,
  ): ModerationReviewRequest {
    return {
      decision: 'APPROVE_ARTICLE',
      reviewNotes: reviewNotes,
      publishStatus: entityStatus,
      normalized: payload,
    };
  }

  function buildEventApprovalRequest(
    entityStatus: EntityStatus,
    payload: EventApprovalPayload,
  ): ModerationReviewRequest {
    return {
      decision: 'APPROVE_EVENT',
      reviewNotes: reviewNotes,
      publishStatus: entityStatus,
      normalized: payload,
    };
  }

  function validateArticleApproval(
    payload: ArticleApprovalPayload | null,
  ): ValidationResult<ArticleApprovalPayload> {
    const errors: ReviewFormErrors = {};
    if (!payload) {
      return { ok: false, errors: { form: 'Article approval fields are not ready yet.' } };
    }

    const normalizedTitle = payload.title.trim();
    const normalizedSummary = payload.summary.trim();
    const normalizedContent = payload.content.trim();
    // optional fields nulled so as not to send empty strings in payload
    const normalizedAuthor = payload.author.trim() || 'anonymous';

    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      errors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      errors.summary = summaryError;
    }

    const contentError = validateRequiredString(
      normalizedContent,
      'Content',
      SUBMISSION_FIELD_LIMITS.content,
    );
    if (contentError) {
      errors.content = contentError;
    }

    if (!payload.topicSlugs || payload.topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }

    const authorError = validateOptionalStringMax(normalizedAuthor, SUBMISSION_FIELD_LIMITS.author);
    if (authorError) {
      errors.author = authorError;
    }
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors: errors };
    }
    return {
      ok: true,
      payload: {
        ...payload,
        title: normalizedTitle,
        summary: normalizedSummary,
        content: normalizedContent,
        author: normalizedAuthor,
      },
    };
  }

  function validateEventApproval(
    payload: EventApprovalPayload | null,
  ): ValidationResult<EventApprovalPayload> {
    const errors: ReviewFormErrors = {};
    if (!payload) {
      return { ok: false, errors: { form: 'Event approval fields are not ready yet.' } };
    }

    const normalizedTitle = payload.title.trim();
    const normalizedSummary = payload.summary.trim();
    const normalizedDescription = payload.description.trim();
    const normalizedEventType = payload.eventType.trim() as EventType;
    const normalizedStartAt = payload.startTime.trim();
    const normalizedLocationName = payload.locationName.trim();
    const normalizedCity = payload.city.trim();
    const normalizedRegion = payload.region.trim();
    const normalizedCountry = payload.country.trim();
    const normalizedPostalCode = payload.postalCode.trim();

    // optional fields nulled so as not to send empty strings in payload
    const normalizedEndAt = payload.endTime?.trim() || null;
    const normalizedPublicLocationDescription = payload.publicLocationDescription?.trim() || null;
    const normalizedAddressLine1 = payload.addressLine1?.trim() || null;
    const normalizedAddressLine2 = payload.addressLine2?.trim() || null;
    const normalizedContactEmail = payload.contactEmail?.trim() || null;
    const normalizedWebsiteUrl = payload.website?.trim() || null;

    const startDate = parseLocalDateTime(normalizedStartAt);
    const endDate = normalizedEndAt ? parseLocalDateTime(normalizedEndAt) : null;

    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      errors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      errors.summary = summaryError;
    }

    const descriptionError = validateRequiredString(
      normalizedDescription,
      'Description',
      SUBMISSION_FIELD_LIMITS.description,
    );
    if (descriptionError) {
      errors.description = descriptionError;
    }

    if (!normalizedEventType) {
      errors.eventType = 'Event Type is required';
    }

    const locationNameError = validateRequiredString(
      normalizedLocationName,
      'Location Name',
      SUBMISSION_FIELD_LIMITS.locationName,
    );
    if (locationNameError) {
      errors.locationName = locationNameError;
    }

    const cityError = validateRequiredString(
      normalizedCity,
      'City',
      SUBMISSION_FIELD_LIMITS.locationAddressCity,
    );
    if (cityError) {
      errors.city = cityError;
    }

    const regionError = validateRequiredString(
      normalizedRegion,
      'State',
      SUBMISSION_FIELD_LIMITS.locationAddressRegion,
    );
    if (regionError) {
      errors.region = regionError;
    }

    const countryError = validateRequiredString(
      normalizedCountry,
      'Country',
      SUBMISSION_FIELD_LIMITS.locationAddressCountry,
    );
    if (countryError) {
      errors.country = countryError;
    }

    if (payload.topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }
    if (!normalizedStartAt) {
      errors.startTime = 'Start date and time is required';
    } else if (!startDate) {
      errors.startTime = 'Enter a valid start date and time';
    }
    if (normalizedEndAt && !endDate) {
      errors.endTime = 'Enter a valid end date and time';
    }
    if (startDate && endDate && endDate < startDate) {
      errors.endTime = 'End date and time must be after the start date and time';
    }

    const publicLocationDescriptionError = validateOptionalStringMax(
      normalizedPublicLocationDescription,
      SUBMISSION_FIELD_LIMITS.publicLocationDescription,
    );
    if (publicLocationDescriptionError) {
      errors.publicLocationDescription = publicLocationDescriptionError;
    }

    const addressLine1Error = validateOptionalStringMax(
      normalizedAddressLine1,
      SUBMISSION_FIELD_LIMITS.locationAddressLine1,
    );
    if (addressLine1Error) {
      errors.addressLine1 = addressLine1Error;
    }

    const addressLine2Error = validateOptionalStringMax(
      normalizedAddressLine2,
      SUBMISSION_FIELD_LIMITS.locationAddressLine2,
    );
    if (addressLine2Error) {
      errors.addressLine2 = addressLine2Error;
    }

    const postalCodeError = validateRequiredString(
      normalizedPostalCode,
      'ZIP Code',
      SUBMISSION_FIELD_LIMITS.locationAddressZip,
    );
    if (postalCodeError) {
      errors.postalCode = postalCodeError;
    }

    const contactEmailError = validateOptionalEmail(
      normalizedContactEmail,
      SUBMISSION_FIELD_LIMITS.contactEmail,
    );
    if (contactEmailError) {
      errors.contactEmail = contactEmailError;
    }

    const websiteUrlError = validateOptionalStringMax(
      normalizedWebsiteUrl,
      SUBMISSION_FIELD_LIMITS.websiteUrl,
    );
    if (websiteUrlError) {
      errors.website = websiteUrlError;
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors: errors };
    }
    return {
      ok: true,
      payload: {
        ...payload,
        title: normalizedTitle,
        summary: normalizedSummary,
        description: normalizedDescription,
        eventType: normalizedEventType,
        startTime: startDate!.toISOString(),
        endTime: endDate ? endDate.toISOString() : null,
        locationName: normalizedLocationName,
        publicLocationDescription: normalizedPublicLocationDescription,
        addressLine1: normalizedAddressLine1,
        addressLine2: normalizedAddressLine2,
        city: normalizedCity,
        region: normalizedRegion,
        country: normalizedCountry,
        postalCode: normalizedPostalCode,
        contactEmail: normalizedContactEmail,
        website: normalizedWebsiteUrl,
      },
    };
  }

  async function approve(entityStatus: EntityStatus) {
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    const validation =
      submission.submissionType === 'ARTICLE'
        ? validateArticleApproval(articleNormalized)
        : validateEventApproval(eventNormalized);

    if (!validation.ok) {
      setErrors(validation.errors);
      setIsRejectConfirming(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const req =
        submission.submissionType === 'ARTICLE'
          ? buildArticleApprovalRequest(entityStatus, validation.payload as ArticleApprovalPayload)
          : buildEventApprovalRequest(entityStatus, validation.payload as EventApprovalPayload);

      const result = await postSubmissionReviewReq(req, submission.id);
      setReviewResult(result);
      setIsSuccess(true);
      setIsRejectConfirming(false);
      scrollToTop();
    } catch (error) {
      handleReviewRequestError(error);
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
      setIsRejectConfirming(false);
      scrollToTop();
    } catch (error) {
      handleReviewRequestError(error);
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
  const [isRejectConfirming, setIsRejectConfirming] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
    }
  }, [errors]);

  const visibleSubmission: ModerationSubmissionDetail = {
    ...submission,
    status: reviewResult?.status ?? submission.status,
    reviewedAt: reviewResult?.reviewedAt ?? submission.reviewedAt,
    createdRecord: reviewResult?.createdRecord ?? submission.createdRecord,
    reviewNotes: reviewNotes,
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
      {visibleSubmission.status !== 'PENDING' && (
        <ReviewOutcomePanel submission={visibleSubmission} />
      )}
      {submitError && (
        <div className="adminReviewBanner adminReviewBannerError" role="status">
          <p className="adminReviewBannerTitle">Unexpected review failure</p>
          <p className="adminReviewBannerText">{submitError}</p>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="adminReviewBanner adminReviewBannerError" role="status">
          <p className="adminReviewBannerTitle">Review could not be recorded</p>
          <p className="adminReviewBannerText">{REVIEW_VALIDATION_MESSAGE}</p>
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
                errors={errors}
                onChange={setEventNormalized}
              />
            )}
          </section>
        </div>
      )}
      {submission.status === 'PENDING' && (
        <section className="adminPanel" aria-labelledby="review-notes-heading">
          <div className="adminPanelHeader">
            <h2 id="review-notes-heading">Review notes</h2>
          </div>
          <label htmlFor="review-notes">Internal notes</label>
          {errors.reviewNotes ? (
            <p id="review-notes-error" className="submissionError">
              {errors.reviewNotes}
            </p>
          ) : null}
          <textarea
            id="review-notes"
            className="submissionTextarea"
            rows={5}
            aria-describedby={errors.reviewNotes ? 'review-notes-error' : undefined}
            aria-invalid={errors.reviewNotes ? true : undefined}
            value={reviewNotes}
            onChange={(event) => setReviewNotes(event.target.value)}
            disabled={(isSuccess ?? false) || submission.status !== 'PENDING'}
          />
        </section>
      )}
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
              {isRejectConfirming ? (
                <>
                  <button
                    type="button"
                    onClick={() => reject()}
                    disabled={isSubmitting || visibleSubmission.status !== 'PENDING'}
                  >
                    Confirm Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRejectConfirming(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRejectConfirming(true)}
                  disabled={isSubmitting || visibleSubmission.status !== 'PENDING'}
                >
                  Reject
                </button>
              )}
            </div>
            {isRejectConfirming ? (
              <p className="adminReviewConfirmation" role="status">
                Rejecting a submission is final for this review flow. Confirm to record the
                rejection.
              </p>
            ) : null}
          </section>
        </div>
      )}
    </section>
  );
}
