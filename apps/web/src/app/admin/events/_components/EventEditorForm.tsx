'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  EVENT_TYPES,
  type AdminEventDetailResponse,
  type AdminEventRequest,
  type EntityStatus,
  type EventType,
  type TopicSummary,
} from '@signal-fire/api-contracts';
import { formatEventTypeLabel } from '@/lib/common/utils';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminEvent, updateAdminEvent } from '@/lib/api/admin';
import {
  mapSubmissionApiErrors,
  parseLocalDateTime,
  SUBMISSION_FIELD_LIMITS,
  validateOptionalStringMax,
  validateRequiredString,
} from '@/lib/submission-form-validation';
import { useRouter } from 'next/navigation';

const EVENT_TYPES_VALUES = EVENT_TYPES;

type EventEditorInitialValues = {
  id: number;
  title: string;
  summary: string;
  content: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  locationName: string;
  publicLocationDescription: string | null;
  contactEmail: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  website: string | null;
  topicSlugs: string[];
  status: EntityStatus;
};

type EventEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: EventEditorInitialValues;
  topics: TopicSummary[];
};

type EventEditorFormErrors = {
  title?: string;
  summary?: string;
  content?: string;
  eventType?: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  topicSlugs?: string;
};

const eventEditorErrorFieldOrder: Array<keyof EventEditorFormErrors> = [
  'title',
  'summary',
  'content',
  'eventType',
  'startTime',
  'endTime',
  'locationName',
  'addressLine1',
  'addressLine2',
  'city',
  'region',
  'country',
  'postalCode',
  'website',
  'topicSlugs',
];

function getScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== 'function') {
    return 'smooth';
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function focusAndScrollTo(id: string) {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: getScrollBehavior(),
    block: 'center',
  });
}

function toDateTimeLocalValue(value: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  const localDate = new Date(date.getTime() - offsetMs);

  return localDate.toISOString().slice(0, 16);
}

function getSubmitStatus(event: FormEvent<HTMLFormElement>): EntityStatus {
  const submitter = event.nativeEvent instanceof SubmitEvent ? event.nativeEvent.submitter : null;
  const action = submitter?.getAttribute('value');

  return action === 'publish' ? 'PUBLISHED' : 'DRAFT';
}

function mapAdminApiFieldToUiField(field: string): keyof EventEditorFormErrors | null {
  const normalizedField = field.startsWith('payload.') ? field.slice('payload.'.length) : field;

  if (normalizedField.startsWith('topicSlugs[')) {
    return 'topicSlugs';
  }

  switch (normalizedField) {
    case 'title':
    case 'summary':
    case 'eventType':
    case 'startTime':
    case 'endTime':
    case 'locationName':
    case 'addressLine1':
    case 'addressLine2':
    case 'city':
    case 'region':
    case 'country':
    case 'postalCode':
    case 'website':
    case 'topicSlugs':
      return normalizedField;
    case 'description':
      return 'content';
    default:
      return null;
  }
}

function getEventControlId(field: keyof EventEditorFormErrors, topics: TopicSummary[]): string {
  if (field === 'topicSlugs') {
    return topics[0] ? `event-topic-${topics[0].slug}` : 'event-topic-group';
  }

  return `event-${field}`;
}

function getEventFieldA11y(
  field: keyof EventEditorFormErrors,
  errors: EventEditorFormErrors,
  helperId?: string,
) {
  const describedBy = [helperId, errors[field] ? `event-${field}-error` : null]
    .filter(Boolean)
    .join(' ');

  return {
    'aria-describedby': describedBy || undefined,
    'aria-invalid': errors[field] ? true : undefined,
  };
}

function parseApiError(error: unknown): string {
  if (error instanceof SubmissionError && error.errors?.length) {
    return error.errors[0].message;
  }

  if (error instanceof ApiError) {
    return `Save failed (${error.status}): ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Save failed due to an unexpected error.';
}

function normalizeOptionalString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeDateTime(value: string): string | null {
  const date = parseLocalDateTime(value);
  return date ? date.toISOString() : null;
}

export default function EventEditorForm({ mode, initialValues, topics }: EventEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues.title);
  const [summary, setSummary] = useState(initialValues.summary);
  const [content, setContent] = useState(initialValues.content);
  const [eventType, setEventType] = useState<EventType>(initialValues.eventType);
  const [startTime, setStartTime] = useState(toDateTimeLocalValue(initialValues.startTime));
  const [endTime, setEndTime] = useState(toDateTimeLocalValue(initialValues.endTime));
  const [locationName, setLocationName] = useState(initialValues.locationName);
  const [addressLine1, setAddressLine1] = useState(initialValues.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(initialValues.addressLine2 ?? '');
  const [city, setCity] = useState(initialValues.city);
  const [region, setRegion] = useState(initialValues.region);
  const [country, setCountry] = useState(initialValues.country);
  const [postalCode, setPostalCode] = useState(initialValues.postalCode);
  const [website, setWebsite] = useState(initialValues.website ?? '');
  const [topicSlugs, setTopicSlugs] = useState<string[]>(initialValues.topicSlugs);
  const [publicLocationDescription] = useState(initialValues.publicLocationDescription ?? '');
  const [contactEmail] = useState(initialValues.contactEmail ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<EventEditorFormErrors>({});

  const selectedTopicSet = useMemo(() => new Set(topicSlugs), [topicSlugs]);

  useEffect(() => {
    const firstErrorField = eventEditorErrorFieldOrder.find((field) => errors[field]);
    if (firstErrorField) {
      focusAndScrollTo(getEventControlId(firstErrorField, topics));
      return;
    }

    if (saveError) {
      focusAndScrollTo('event-submit-error');
    }
  }, [errors, saveError, topics]);

  function toggleTopic(topicSlug: string) {
    setTopicSlugs((current) =>
      current.includes(topicSlug)
        ? current.filter((item) => item !== topicSlug)
        : [...current, topicSlug],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    setErrors({});

    const nextStatus = getSubmitStatus(event);

    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedContent = content.trim();
    const normalizedLocationName = locationName.trim();
    const normalizedAddressLine1 = normalizeOptionalString(addressLine1);
    const normalizedAddressLine2 = normalizeOptionalString(addressLine2);
    const normalizedCity = city.trim();
    const normalizedRegion = region.trim();
    const normalizedCountry = country.trim();
    const normalizedPostalCode = postalCode.trim();
    const normalizedWebsite = normalizeOptionalString(website);
    const normalizedStartTime = normalizeDateTime(startTime);
    const normalizedEndTime = normalizeDateTime(endTime);

    const nextErrors: EventEditorFormErrors = {};

    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      nextErrors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      nextErrors.summary = summaryError;
    }

    const contentError = validateRequiredString(
      normalizedContent,
      'Body',
      SUBMISSION_FIELD_LIMITS.description,
    );
    if (contentError) {
      nextErrors.content = contentError;
    }

    if (!eventType) {
      nextErrors.eventType = 'Event type is required';
    }

    if (!normalizedStartTime) {
      nextErrors.startTime = 'Start date and time is required';
    }

    if (endTime && !normalizedEndTime) {
      nextErrors.endTime = 'Enter a valid end date and time';
    }

    if (
      normalizedStartTime &&
      normalizedEndTime &&
      new Date(normalizedEndTime) < new Date(normalizedStartTime)
    ) {
      nextErrors.endTime = 'End date and time must be after the start date and time';
    }

    const locationNameError = validateRequiredString(
      normalizedLocationName,
      'Location name',
      SUBMISSION_FIELD_LIMITS.locationName,
    );
    if (locationNameError) {
      nextErrors.locationName = locationNameError;
    }

    const addressLine1Error = validateOptionalStringMax(
      normalizedAddressLine1,
      SUBMISSION_FIELD_LIMITS.locationAddressLine1,
    );
    if (addressLine1Error) {
      nextErrors.addressLine1 = addressLine1Error;
    }

    const addressLine2Error = validateOptionalStringMax(
      normalizedAddressLine2,
      SUBMISSION_FIELD_LIMITS.locationAddressLine2,
    );
    if (addressLine2Error) {
      nextErrors.addressLine2 = addressLine2Error;
    }

    const cityError = validateRequiredString(
      normalizedCity,
      'City',
      SUBMISSION_FIELD_LIMITS.locationAddressCity,
    );
    if (cityError) {
      nextErrors.city = cityError;
    }

    const regionError = validateRequiredString(
      normalizedRegion,
      'State',
      SUBMISSION_FIELD_LIMITS.locationAddressRegion,
    );
    if (regionError) {
      nextErrors.region = regionError;
    }

    const countryError = validateRequiredString(
      normalizedCountry,
      'Country',
      SUBMISSION_FIELD_LIMITS.locationAddressCountry,
    );
    if (countryError) {
      nextErrors.country = countryError;
    }

    const postalCodeError = validateRequiredString(
      normalizedPostalCode,
      'Postal Code',
      SUBMISSION_FIELD_LIMITS.locationAddressZip,
    );
    if (postalCodeError) {
      nextErrors.postalCode = postalCodeError;
    }

    const websiteError = validateOptionalStringMax(
      normalizedWebsite,
      SUBMISSION_FIELD_LIMITS.websiteUrl,
    );
    if (websiteError) {
      nextErrors.website = websiteError;
    }

    if (topicSlugs.length === 0) {
      nextErrors.topicSlugs = 'Select at least one topic';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload: AdminEventRequest = {
      title: normalizedTitle,
      summary: normalizedSummary,
      description: normalizedContent,
      eventType,
      startTime: normalizedStartTime!,
      endTime: normalizedEndTime,
      locationName: normalizedLocationName,
      publicLocationDescription: publicLocationDescription.trim().length
        ? publicLocationDescription.trim()
        : null,
      contactEmail: contactEmail.trim().length ? contactEmail.trim() : null,
      addressLine1: normalizedAddressLine1,
      addressLine2: normalizedAddressLine2,
      city: normalizedCity,
      region: normalizedRegion,
      country: normalizedCountry,
      postalCode: normalizedPostalCode,
      website: normalizedWebsite,
      status: nextStatus,
      topicSlugs,
    };

    setIsSaving(true);
    try {
      let result: AdminEventDetailResponse;
      if (mode === 'create') {
        result = await createAdminEvent(payload);
      } else {
        result = await updateAdminEvent(initialValues.id, payload);
      }

      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      if (mode === 'create') {
        router.replace(`/admin/events/${result.id}`, { scroll: true });
        router.refresh();
      } else {
        setSaveSuccess(
          result.status === 'PUBLISHED'
            ? 'Event updated and published successfully.'
            : 'Event updated and saved as draft.',
        );
        router.refresh();
      }
    } catch (error) {
      if (error instanceof SubmissionError) {
        const { fieldErrors, formError } = mapSubmissionApiErrors(
          error.errors,
          mapAdminApiFieldToUiField,
        );

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors as EventEditorFormErrors);
        }

        if (formError) {
          setSaveError(formError);
        } else if (Object.keys(fieldErrors).length === 0) {
          setSaveError(parseApiError(error));
        }
      } else {
        setSaveError(parseApiError(error));
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="submissionForm eventEditorForm" onSubmit={handleSubmit} noValidate>
      <section className="adminPanel">
        <div className="adminPanelHeader">
          <h2>{mode === 'create' ? 'Create event' : 'Edit event'}</h2>
        </div>

        {saveSuccess ? (
          <div className="adminReviewBanner actionEditorSuccessBanner" role="status">
            <p className="adminReviewBannerTitle">Event saved</p>
            <p className="adminReviewBannerText">{saveSuccess}</p>
          </div>
        ) : null}

        <div className="eventEditorLayout">
          <section className="submissionField eventEditorTitleField">
            <label className="submissionLabel" htmlFor="event-title">
              Title
            </label>
            <input
              id="event-title"
              className="submissionControl"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              {...getEventFieldA11y('title', errors)}
              required
            />
            {errors.title ? (
              <p id="event-title-error" className="submissionError">
                {errors.title}
              </p>
            ) : null}
          </section>

          <section className="submissionField eventEditorSummaryField">
            <label className="submissionLabel" htmlFor="event-summary">
              Summary
            </label>
            <textarea
              id="event-summary"
              className="submissionTextarea eventEditorTextareaSummary"
              value={summary}
              rows={6}
              onChange={(event) => setSummary(event.target.value)}
              {...getEventFieldA11y('summary', errors)}
              required
            />
            {errors.summary ? (
              <p id="event-summary-error" className="submissionError">
                {errors.summary}
              </p>
            ) : null}
          </section>

          <section className="submissionField eventEditorContentField">
            <label className="submissionLabel" htmlFor="event-content">
              Body
            </label>
            <textarea
              id="event-content"
              className="submissionTextarea eventEditorTextareaContent"
              value={content}
              rows={18}
              onChange={(event) => setContent(event.target.value)}
              {...getEventFieldA11y('content', errors)}
              required
            />
            {errors.content ? (
              <p id="event-content-error" className="submissionError">
                {errors.content}
              </p>
            ) : null}
          </section>

          <div className="eventEditorBottomRow">
            <section className="eventEditorLocationCard" aria-label="Location details">
              <section className="submissionField eventEditorLocationField">
                <label className="submissionLabel" htmlFor="event-locationName">
                  Location Name
                </label>
                <input
                  id="event-locationName"
                  className="submissionControl"
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  {...getEventFieldA11y('locationName', errors)}
                  required
                />
                {errors.locationName ? (
                  <p id="event-locationName-error" className="submissionError">
                    {errors.locationName}
                  </p>
                ) : null}
              </section>

              <section className="submissionField eventEditorWebsiteField">
                <label className="submissionLabel" htmlFor="event-website">
                  Website
                </label>
                <input
                  id="event-website"
                  className="submissionControl"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  {...getEventFieldA11y('website', errors)}
                />
                {errors.website ? (
                  <p id="event-website-error" className="submissionError">
                    {errors.website}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-addressLine1">
                  Street Address
                </label>
                <input
                  id="event-addressLine1"
                  className="submissionControl"
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
                  {...getEventFieldA11y('addressLine1', errors)}
                />
                {errors.addressLine1 ? (
                  <p id="event-addressLine1-error" className="submissionError">
                    {errors.addressLine1}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-addressLine2">
                  Address Line 2
                </label>
                <input
                  id="event-addressLine2"
                  className="submissionControl"
                  value={addressLine2}
                  onChange={(event) => setAddressLine2(event.target.value)}
                  {...getEventFieldA11y('addressLine2', errors)}
                />
                {errors.addressLine2 ? (
                  <p id="event-addressLine2-error" className="submissionError">
                    {errors.addressLine2}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-city">
                  City
                </label>
                <input
                  id="event-city"
                  className="submissionControl"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  {...getEventFieldA11y('city', errors)}
                  required
                />
                {errors.city ? (
                  <p id="event-city-error" className="submissionError">
                    {errors.city}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-region">
                  State
                </label>
                <input
                  id="event-region"
                  className="submissionControl"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  {...getEventFieldA11y('region', errors)}
                  required
                />
                {errors.region ? (
                  <p id="event-region-error" className="submissionError">
                    {errors.region}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-country">
                  Country
                </label>
                <input
                  id="event-country"
                  className="submissionControl"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  {...getEventFieldA11y('country', errors)}
                  required
                />
                {errors.country ? (
                  <p id="event-country-error" className="submissionError">
                    {errors.country}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-postalCode">
                  Postal Code
                </label>
                <input
                  id="event-postalCode"
                  className="submissionControl"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  {...getEventFieldA11y('postalCode', errors)}
                  required
                />
                {errors.postalCode ? (
                  <p id="event-postalCode-error" className="submissionError">
                    {errors.postalCode}
                  </p>
                ) : null}
              </section>
            </section>

            <aside className="eventEditorSidebar" aria-label="Event settings">
              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-eventType">
                  Event type
                </label>
                <select
                  id="event-eventType"
                  className="submissionControl"
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value as EventType)}
                  {...getEventFieldA11y('eventType', errors)}
                  required
                >
                  {EVENT_TYPES_VALUES.map((item) => (
                    <option key={item} value={item}>
                      {formatEventTypeLabel(item)}
                    </option>
                  ))}
                </select>
                {errors.eventType ? (
                  <p id="event-eventType-error" className="submissionError">
                    {errors.eventType}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-startTime">
                  Start Time
                </label>
                <input
                  id="event-startTime"
                  type="datetime-local"
                  className="submissionControl"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  {...getEventFieldA11y('startTime', errors)}
                  required
                />
                {errors.startTime ? (
                  <p id="event-startTime-error" className="submissionError">
                    {errors.startTime}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-endTime">
                  End Time
                </label>
                <input
                  id="event-endTime"
                  type="datetime-local"
                  className="submissionControl"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  {...getEventFieldA11y('endTime', errors)}
                />
                {errors.endTime ? (
                  <p id="event-endTime-error" className="submissionError">
                    {errors.endTime}
                  </p>
                ) : null}
              </section>

              <section className="eventEditorTopics" aria-label="Event topics">
                <fieldset
                  id="event-topic-group"
                  className="submissionCheckboxGroup"
                  tabIndex={-1}
                  {...getEventFieldA11y('topicSlugs', errors)}
                >
                  <legend className="submissionLabel">Topics</legend>
                  {topics.length === 0 ? (
                    <p>No topics are available to assign.</p>
                  ) : (
                    <div className="adminTopicGrid">
                      {topics.map((topic) => (
                        <label key={topic.slug} className="submissionCheckboxOption">
                          <input
                            id={`event-topic-${topic.slug}`}
                            type="checkbox"
                            checked={selectedTopicSet.has(topic.slug)}
                            onChange={() => toggleTopic(topic.slug)}
                          />
                          <span>{topic.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
                {errors.topicSlugs ? (
                  <p id="event-topicSlugs-error" className="submissionError">
                    {errors.topicSlugs}
                  </p>
                ) : null}
              </section>
            </aside>
          </div>
        </div>

        <div className="eventEditorFooter">
          {saveError ? (
            <p id="event-submit-error" className="adminError" tabIndex={-1}>
              {saveError}
            </p>
          ) : null}
          <div className="eventEditorFooterActions">
            <button
              className="primaryCTA"
              type="submit"
              name="status"
              value="publish"
              disabled={isSaving}
            >
              {mode === 'create' ? 'Create published' : 'Publish changes'}
            </button>
            <button
              className="primaryCTA"
              type="submit"
              name="status"
              value="draft"
              disabled={isSaving}
            >
              {mode === 'create' ? 'Create draft' : 'Save draft'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
