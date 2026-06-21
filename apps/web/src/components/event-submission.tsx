'use client';
import { TopicSummary } from '@signal-fire/api-contracts';
import type { ComponentProps } from 'react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { postEventSubmission } from '@/lib/api/submit';
import { SubmissionError } from '@/lib/api/error';
import { EVENT_TYPES, EventType } from '@signal-fire/api-contracts';
import { SubmissionGuidance } from '@/components/submission-guidance';
import {
  mapSubmissionApiFieldToUiField,
  mapSubmissionApiErrors,
  parseLocalDateTime,
  SUBMISSION_FIELD_LIMITS,
  validateOptionalEmail,
  validateOptionalUrl,
  validateOptionalStringMax,
  validateRequiredString,
} from '@/lib/submission-form-validation';
import { focusAndScrollTo, getFieldA11y } from '@/lib/form-ui';
import { formatEventTypeLabel } from '@/lib/common/utils';
import { US_STATE_OPTIONS } from '@/lib/us-state-options';

type EventSubmissionFormProps = {
  topics: TopicSummary[];
};

type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

type EventSubmissionFormErrors = {
  title?: string;
  summary?: string;
  description?: string;
  eventType?: string;
  startAt?: string;
  locationName?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  topicSlugs?: string;
  endAt?: string;
  publicLocationDescription?: string;
  addressLine1?: string;
  addressLine2?: string;
  contactEmail?: string;
  websiteUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
};

const eventErrorFieldOrder: Array<keyof EventSubmissionFormErrors> = [
  'title',
  'summary',
  'description',
  'eventType',
  'startAt',
  'endAt',
  'locationName',
  'city',
  'region',
  'country',
  'publicLocationDescription',
  'addressLine1',
  'addressLine2',
  'postalCode',
  'topicSlugs',
  'websiteUrl',
  'contactEmail',
  'submitterName',
  'submitterEmail',
];

export function EventSubmissionForm({ topics }: EventSubmissionFormProps) {
  // ------ form fields --------
  // required
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [startAt, setStartAt] = useState('');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const country = 'US';
  const [topicSlugs, setTopicSlugs] = useState<string[]>([]);

  // optional
  const [endAt, setEndAt] = useState('');
  const [publicLocationDescription, setPublicLocationDescription] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  // ------------------------

  // ------ submission flow control -----
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<EventSubmissionFormErrors>({});
  // ------------------------------------

  const getEventControlId = useCallback(
    (field: keyof EventSubmissionFormErrors): string => {
      if (field === 'topicSlugs') {
        return topics[0] ? `event-topic-${topics[0].slug}` : 'event-topic-group';
      }

      return `event-${field}`;
    },
    [topics],
  );

  useEffect(() => {
    const firstErrorField = eventErrorFieldOrder.find((field) => errors[field]);
    if (firstErrorField) {
      focusAndScrollTo(getEventControlId(firstErrorField));
      return;
    }
    if (submitError) {
      focusAndScrollTo('event-submit-error');
    }
  }, [errors, getEventControlId, submitError]);

  const handleToggle = (topic: string) => {
    setTopicSlugs(
      (prev) =>
        prev.includes(topic)
          ? prev.filter((t) => t !== topic) // Remove if already checked
          : [...prev, topic], // Add if not checked
    );
  };

  function mapApiFieldToUiField(field: string): keyof EventSubmissionFormErrors | null {
    const sharedField = mapSubmissionApiFieldToUiField(field);
    if (sharedField) {
      return sharedField as keyof EventSubmissionFormErrors;
    }

    switch (field) {
      case 'payload.title':
        return 'title';
      case 'payload.summary':
        return 'summary';
      case 'payload.description':
        return 'description';
      case 'payload.eventType':
        return 'eventType';
      case 'payload.startTime':
        return 'startAt';
      case 'payload.endTime':
        return 'endAt';
      case 'payload.locationName':
        return 'locationName';
      case 'payload.publicLocationDescription':
        return 'publicLocationDescription';
      case 'payload.locationAddressLine1':
        return 'addressLine1';
      case 'payload.locationAddressLine2':
        return 'addressLine2';
      case 'payload.locationAddressCity':
        return 'city';
      case 'payload.locationAddressRegion':
        return 'region';
      case 'payload.locationAddressCountry':
        return 'country';
      case 'payload.locationAddressZip':
        return 'postalCode';
      case 'payload.contactEmail':
        return 'contactEmail';
      case 'payload.topicSlugs':
        return 'topicSlugs';
      case 'payload.websiteUrl':
        return 'websiteUrl';
      case 'submitterName':
        return 'submitterName';
      case 'submitterEmail':
        return 'submitterEmail';
      default:
        return null;
    }
  }

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setErrors({});

    // required strings can not be null due to the type in the contract
    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedDescription = description.trim();
    const normalizedEventType = eventType.trim() as EventType;
    const normalizedStartAt = startAt.trim();
    const normalizedLocationName = locationName.trim();
    const normalizedCity = city.trim();
    const normalizedRegion = region.trim();
    const normalizedCountry = country.trim();

    // optional fields nulled so as not to send empty strings in payload
    const normalizedEndAt = endAt.trim() || null;
    const normalizedPublicLocationDescription = publicLocationDescription.trim() || null;
    const normalizedAddressLine1 = addressLine1.trim() || null;
    const normalizedAddressLine2 = addressLine2.trim() || null;
    const normalizedPostalCode = postalCode.trim();
    const normalizedContactEmail = contactEmail.trim() || null;
    const normalizedWebsiteUrl = websiteUrl.trim() || null;
    const normalizedSubmitterName = submitterName.trim() || null;
    const normalizedSubmitterEmail = submitterEmail.trim() || null;

    const startDate = parseLocalDateTime(normalizedStartAt);
    const endDate = normalizedEndAt ? parseLocalDateTime(normalizedEndAt) : null;

    const errors: EventSubmissionFormErrors = {};
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

    if (!eventType) {
      errors.eventType = 'Event type is required';
    }

    const locationNameError = validateRequiredString(
      normalizedLocationName,
      'Location name',
      SUBMISSION_FIELD_LIMITS.locationName,
    );
    if (locationNameError) {
      errors.locationName = locationNameError;
    }

    const cityError = validateRequiredString(
      normalizedCity,
      'Location address city',
      SUBMISSION_FIELD_LIMITS.locationAddressCity,
    );
    if (cityError) {
      errors.city = cityError;
    }

    const regionError = validateRequiredString(
      normalizedRegion,
      'Location address region',
      SUBMISSION_FIELD_LIMITS.locationAddressRegion,
    );
    if (regionError) {
      errors.region = regionError;
    }

    const countryError = validateRequiredString(
      normalizedCountry,
      'Location address country',
      SUBMISSION_FIELD_LIMITS.locationAddressCountry,
    );
    if (countryError) {
      errors.country = countryError;
    }

    if (topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }
    if (!normalizedStartAt) {
      errors.startAt = 'Start date and time is required';
    } else if (!startDate) {
      errors.startAt = 'Enter a valid start date and time';
    }
    if (normalizedEndAt && !endDate) {
      errors.endAt = 'Enter a valid end date and time';
    }
    if (startDate && endDate && endDate < startDate) {
      errors.endAt = 'End date and time must be after the start date and time';
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
      'Postal Code',
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

    const websiteUrlError =
      validateOptionalStringMax(normalizedWebsiteUrl, SUBMISSION_FIELD_LIMITS.websiteUrl) ??
      validateOptionalUrl(normalizedWebsiteUrl, 'Website URL', SUBMISSION_FIELD_LIMITS.websiteUrl);
    if (websiteUrlError) {
      errors.websiteUrl = websiteUrlError;
    }

    const submitterNameError = validateOptionalStringMax(
      normalizedSubmitterName,
      SUBMISSION_FIELD_LIMITS.submitterName,
    );
    if (submitterNameError) {
      errors.submitterName = submitterNameError;
    }

    const submitterEmailError = validateOptionalEmail(
      normalizedSubmitterEmail,
      SUBMISSION_FIELD_LIMITS.submitterEmail,
    );
    if (submitterEmailError) {
      errors.submitterEmail = submitterEmailError;
    }

    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await postEventSubmission({
          submissionType: 'EVENT',
          submitterName: normalizedSubmitterName,
          submitterEmail: normalizedSubmitterEmail,
          payload: {
            title: normalizedTitle,
            summary: normalizedSummary,
            description: normalizedDescription,
            eventType: normalizedEventType,
            startTime: startDate!.toISOString(),
            endTime: endDate ? endDate.toISOString() : null,
            locationName: normalizedLocationName,
            publicLocationDescription: normalizedPublicLocationDescription,
            locationAddressLine1: normalizedAddressLine1,
            locationAddressLine2: normalizedAddressLine2,
            locationAddressCity: normalizedCity,
            locationAddressRegion: normalizedRegion,
            locationAddressCountry: normalizedCountry,
            locationAddressZip: normalizedPostalCode,
            contactEmail: normalizedContactEmail,
            topicSlugs: topicSlugs,
            websiteUrl: normalizedWebsiteUrl,
          },
        });
        setIsSuccess(true);
      } catch (error) {
        if (error instanceof SubmissionError) {
          const { fieldErrors, formError } = mapSubmissionApiErrors(
            error.errors,
            mapApiFieldToUiField,
          );

          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }

          if (formError) {
            setSubmitError(formError);
          } else if (Object.keys(fieldErrors).length === 0) {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  if (isSuccess) {
    return (
      <div className={'submissionSuccess'}>
        <p className="section-label">Submission received</p>
        <h1 className="pageTitle">We&apos;ve got it.</h1>
        <p className="page-intro">
          Your submission is in. A real person reviews everything before it goes live.
        </p>
        <p className="metaText">
          If you left an email address, we&apos;ll reach out if we have questions.
        </p>
        <div className="ctaRow submissionSuccessActions">
          <Link href="/events" className="primaryCTA">
            Browse Events
          </Link>
          <Link href="/actions" className="secondaryCTA">
            Take Action
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <form className={'submissionForm'} onSubmit={submit} noValidate>
        <section className="page-section">
          <h1 className="pageTitle">Submit an Event</h1>
          <p className="page-intro">Share an event people can actually show up for.</p>
          <div className="submissionIntroPanel">
            <p className="submissionIntroTitle">What makes an event useful here</p>
            <p className="submissionIntroBody">
              Give people the essentials: what the event is, when it starts, where it is, and why it
              matters. Clear logistics and a trustworthy source make moderation faster.
            </p>
            <p className="submissionIntroMeta">
              Your submission goes to a reviewer before anything goes live. Fields marked with * are
              required.
            </p>
          </div>
          <SubmissionGuidance />
          <section className="submissionSection">
            <p className="section-label">Basics</p>
            <h2>Basic Information</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-title">
                <span>* Title</span>
                <input
                  id="event-title"
                  className={'submissionControl'}
                  value={title}
                  placeholder="Title"
                  onChange={(event) => setTitle(event.target.value)}
                  {...getFieldA11y('title', errors, 'event')}
                />
              </label>
              {errors.title ? (
                <p id="event-title-error" className="submissionError" role="alert">
                  {errors.title}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-summary">
                <span>* Summary</span>
                <textarea
                  id="event-summary"
                  className="submissionTextarea"
                  value={summary}
                  placeholder="Briefly describe the event"
                  rows={4}
                  onChange={(event) => setSummary(event.target.value)}
                  {...getFieldA11y('summary', errors, 'event')}
                />
              </label>
              {errors.summary ? (
                <p id="event-summary-error" className="submissionError" role="alert">
                  {errors.summary}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-description">
                <span>* Description</span>
                <textarea
                  id="event-description"
                  className="submissionTextarea"
                  value={description}
                  placeholder="Provide additional details about the event"
                  rows={12}
                  onChange={(event) => setDescription(event.target.value)}
                  {...getFieldA11y('description', errors, 'event')}
                />
              </label>
              {errors.description ? (
                <p id="event-description-error" className="submissionError" role="alert">
                  {errors.description}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-eventType">
                <span>* Event Type</span>
                <select
                  id="event-eventType"
                  className="submissionControl"
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value)}
                  {...getFieldA11y('eventType', errors, 'event')}
                >
                  <option value="">Select an event type</option>
                  {EVENT_TYPES.map((eventType) => (
                    <option value={eventType} key={eventType}>
                      {formatEventTypeLabel(eventType)}
                    </option>
                  ))}
                </select>
              </label>
              {errors.eventType ? (
                <p id="event-eventType-error" className="submissionError" role="alert">
                  {errors.eventType}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <p className="section-label">Schedule</p>
            <h2>Date and Time</h2>

            <div className="submissionFieldRow">
              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-startAt">
                  <span>* Start date and time</span>
                  <input
                    id="event-startAt"
                    type="datetime-local"
                    className="submissionControl"
                    value={startAt}
                    onChange={(event) => setStartAt(event.target.value)}
                    {...getFieldA11y('startAt', errors, 'event')}
                  />
                </label>
                {errors.startAt ? (
                  <p id="event-startAt-error" className="submissionError" role="alert">
                    {errors.startAt}
                  </p>
                ) : null}
              </section>

              <section className="submissionField">
                <label className="submissionLabel" htmlFor="event-endAt">
                  <span>End date and time (optional)</span>
                  <input
                    id="event-endAt"
                    className="submissionControl"
                    value={endAt}
                    type="datetime-local"
                    onChange={(event) => setEndAt(event.target.value)}
                    {...getFieldA11y('endAt', errors, 'event')}
                  />
                </label>
                {errors.endAt ? (
                  <p id="event-endAt-error" className="submissionError" role="alert">
                    {errors.endAt}
                  </p>
                ) : null}
              </section>
            </div>
          </section>

          <section className="submissionSection">
            <p className="section-label">Location</p>
            <h2>Location</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-locationName">
                <span>* Location Name</span>
                <input
                  id="event-locationName"
                  className={'submissionControl'}
                  value={locationName}
                  placeholder="Community Center"
                  onChange={(event) => setLocationName(event.target.value)}
                  {...getFieldA11y('locationName', errors, 'event')}
                />
              </label>
              {errors.locationName ? (
                <p id="event-locationName-error" className="submissionError" role="alert">
                  {errors.locationName}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-city">
                <span>* City</span>
                <input
                  id="event-city"
                  className={'submissionControl'}
                  value={city}
                  placeholder="City"
                  onChange={(event) => setCity(event.target.value)}
                  {...getFieldA11y('city', errors, 'event')}
                />
              </label>
              {errors.city ? (
                <p id="event-city-error" className="submissionError" role="alert">
                  {errors.city}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-region">
                <span>* State</span>
                <select
                  id="event-region"
                  className="submissionControl"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  {...getFieldA11y('region', errors, 'event')}
                >
                  <option value="">Select a state</option>
                  {US_STATE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {errors.region ? (
                <p id="event-region-error" className="submissionError" role="alert">
                  {errors.region}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-country">
                <span>* Country</span>
                <input
                  id="event-country"
                  className={'submissionControl'}
                  value={country}
                  disabled
                  readOnly
                  {...getFieldA11y('country', errors, 'event')}
                />
              </label>
              {errors.country ? (
                <p id="event-country-error" className="submissionError" role="alert">
                  {errors.country}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-publicLocationDescription">
                <span>Location Description (optional)</span>
                <input
                  id="event-publicLocationDescription"
                  className={'submissionControl'}
                  value={publicLocationDescription}
                  placeholder="Meet organizers near the fountain"
                  onChange={(event) => setPublicLocationDescription(event.target.value)}
                  {...getFieldA11y('publicLocationDescription', errors, 'event')}
                />
              </label>
              {errors.publicLocationDescription ? (
                <p
                  id="event-publicLocationDescription-error"
                  className="submissionError"
                  role="alert"
                >
                  {errors.publicLocationDescription}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-addressLine1">
                <span>Address Line 1 (optional)</span>
                <input
                  id="event-addressLine1"
                  className={'submissionControl'}
                  value={addressLine1}
                  placeholder="123 Main St"
                  onChange={(event) => setAddressLine1(event.target.value)}
                  {...getFieldA11y('addressLine1', errors, 'event')}
                />
              </label>
              {errors.addressLine1 ? (
                <p id="event-addressLine1-error" className="submissionError" role="alert">
                  {errors.addressLine1}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-addressLine2">
                <span>Address Line 2 (optional)</span>
                <input
                  id="event-addressLine2"
                  className={'submissionControl'}
                  value={addressLine2}
                  placeholder="Suite A"
                  onChange={(event) => setAddressLine2(event.target.value)}
                  {...getFieldA11y('addressLine2', errors, 'event')}
                />
              </label>
              {errors.addressLine2 ? (
                <p id="event-addressLine2-error" className="submissionError" role="alert">
                  {errors.addressLine2}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-postalCode">
                <span>* ZIP Code</span>
                <input
                  id="event-postalCode"
                  className={'submissionControl'}
                  value={postalCode}
                  placeholder="19107"
                  onChange={(event) => setPostalCode(event.target.value)}
                  {...getFieldA11y('postalCode', errors, 'event')}
                />
              </label>
              {errors.postalCode ? (
                <p id="event-postalCode-error" className="submissionError" role="alert">
                  {errors.postalCode}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <p className="section-label">Context</p>
            <h2>Topics</h2>
            <section className="submissionField">
              <div id="event-topic-group" className="submissionLabel">
                * Topics
              </div>
              <p id="event-topic-helper" className="submissionHelper">
                Select at least one topic
              </p>
              <div
                className="submissionCheckboxGroup"
                role="group"
                aria-labelledby="event-topic-group"
                {...getFieldA11y('topicSlugs', errors, 'event', 'event-topic-helper')}
              >
                {topics.map((topic) => (
                  <label
                    className="submissionCheckboxOption"
                    htmlFor={`event-topic-${topic.slug}`}
                    key={topic.id}
                  >
                    <input
                      id={`event-topic-${topic.slug}`}
                      type="checkbox"
                      checked={topicSlugs.includes(topic.slug)}
                      onChange={() => handleToggle(topic.slug)}
                    />
                    {topic.name}
                  </label>
                ))}
              </div>
              {errors.topicSlugs ? (
                <p id="event-topicSlugs-error" className="submissionError" role="alert">
                  {errors.topicSlugs}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <p className="section-label">Verification</p>
            <h2>Website</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-websiteUrl">
                Website URL (optional)
              </label>
              <p id="event-website-helper" className="submissionHelper">
                Public event, organizer, or RSVP URL
              </p>
              <input
                id="event-websiteUrl"
                className="submissionControl"
                type="text"
                placeholder="https://example.org/event"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                {...getFieldA11y('websiteUrl', errors, 'event', 'event-website-helper')}
              />
              {errors.websiteUrl ? (
                <p id="event-websiteUrl-error" className="submissionError" role="alert">
                  {errors.websiteUrl}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <p className="section-label">Follow-up</p>
            <h2>Contact Information</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-contactEmail">
                Contact Email (optional)
              </label>
              <span id="event-contact-email-helper" className="submissionHelper">
                Used publicly only if the event needs a contact address
              </span>
              <input
                id="event-contactEmail"
                className={'submissionControl'}
                value={contactEmail}
                placeholder="organizer@example.com"
                type={'email'}
                onChange={(event) => setContactEmail(event.target.value)}
                {...getFieldA11y('contactEmail', errors, 'event', 'event-contact-email-helper')}
              />
              {errors.contactEmail ? (
                <p id="event-contactEmail-error" className="submissionError" role="alert">
                  {errors.contactEmail}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-submitterName">
                <span>Name (optional)</span>
                <input
                  id="event-submitterName"
                  className={'submissionControl'}
                  value={submitterName}
                  placeholder="Your name"
                  onChange={(event) => setSubmitterName(event.target.value)}
                  {...getFieldA11y('submitterName', errors, 'event')}
                />
              </label>

              {errors.submitterName ? (
                <p id="event-submitterName-error" className="submissionError" role="alert">
                  {errors.submitterName}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-submitterEmail">
                Email (optional)
              </label>
              <span id="event-submitter-email-helper" className="submissionHelper">
                Used only if we need to follow up about your submission
              </span>
              <input
                id="event-submitterEmail"
                className={'submissionControl'}
                value={submitterEmail}
                placeholder="name@example.com"
                type={'email'}
                onChange={(event) => setSubmitterEmail(event.target.value)}
                {...getFieldA11y('submitterEmail', errors, 'event', 'event-submitter-email-helper')}
              />
              {errors.submitterEmail ? (
                <p id="event-submitterEmail-error" className="submissionError" role="alert">
                  {errors.submitterEmail}
                </p>
              ) : null}
            </section>
          </section>
        </section>

        {submitError ? (
          <p id="event-submit-error" className="submissionGlobalError" tabIndex={-1}>
            {submitError}
          </p>
        ) : null}
        <div className="submissionActions">
          <button className="primaryCTA" type="submit" disabled={isSubmitting}>
            Submit Event
          </button>
        </div>
      </form>
    );
  }
}
