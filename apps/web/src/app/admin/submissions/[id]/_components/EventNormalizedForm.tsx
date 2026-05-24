import { useEffect, useState } from 'react';

import {
  EVENT_TYPES,
  type EventApprovalPayload,
  EventType,
  ModerationSubmissionDetail,
  TopicSummary,
} from '@signal-fire/api-contracts';
import { ReviewFormErrors } from '@/app/admin/submissions/[id]/SubmissionReviewPageContent';

type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

function formatEventTypeLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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

// function fromDateTimeLocalValue(value: string): string | null {
//   if (!value) {
//     return null;
//   }
//
//   return new Date(value).toISOString();
// }

function parseEventType(value: string): EventType {
  if (EVENT_TYPES.includes(value as EventType)) {
    return value as EventType;
  }

  throw new Error(`Invalid event type: ${value}`);
}

export default function EventNormalizationForm({
  submission,
  topics,
  success,
  errors,
  onChange,
}: {
  submission: EventModerationSubmission;
  topics: TopicSummary[];
  success: boolean;
  errors: ReviewFormErrors;
  onChange: (value: EventApprovalPayload) => void;
}) {
  const [title, setTitle] = useState(submission.submittedContent.title);
  const [summary, setSummary] = useState(submission.submittedContent.summary);
  const [description, setDescription] = useState(submission.submittedContent.description);
  const [eventType, setEventType] = useState<EventType>(submission.submittedContent.eventType);
  const [startTime, setStartTime] = useState(
    toDateTimeLocalValue(submission.submittedContent.startTime),
  );
  const [endTime, setEndTime] = useState(toDateTimeLocalValue(submission.submittedContent.endTime));
  const [publicLocationDescription, setPublicLocationDescription] = useState(
    submission.submittedContent.publicLocationDescription ?? '',
  );
  const [locationName, setLocationName] = useState(submission.submittedContent.locationName);
  const [addressLine1, setAddressLine1] = useState(submission.submittedContent.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(submission.submittedContent.addressLine2 ?? '');
  const [city, setCity] = useState(submission.submittedContent.city ?? '');
  const [region, setRegion] = useState(submission.submittedContent.region ?? '');
  const [country, setCountry] = useState(submission.submittedContent.country ?? '');
  const [postalCode, setPostalCode] = useState(submission.submittedContent.postalCode ?? '');
  const [website, setWebsite] = useState(submission.submittedContent.website ?? '');
  const [contactEmail, setContactEmail] = useState(submission.submittedContent.contactEmail ?? '');
  const [topicSlugs, setTopicSlugs] = useState<string[]>(
    submission.submittedContent.topics.map((topic) => topic.slug),
  );

  useEffect(() => {
    onChange({
      title,
      summary,
      description,
      eventType,
      startTime,
      endTime,
      publicLocationDescription,
      locationName,
      addressLine1,
      addressLine2,
      city,
      region,
      country,
      postalCode,
      website,
      contactEmail,
      topicSlugs,
    });
  }, [
    title,
    summary,
    description,
    eventType,
    startTime,
    endTime,
    publicLocationDescription,
    locationName,
    addressLine1,
    addressLine2,
    city,
    region,
    country,
    postalCode,
    website,
    contactEmail,
    topicSlugs,
    onChange,
  ]);

  const handleToggle = (topic: string) => {
    setTopicSlugs((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  return (
    <dl className="adminDefinitionList">
      <dt>
        <label htmlFor="normalized-title">Title</label>
      </dt>
      <dd>
        {errors.title ? (
          <p id="normalized-title-error" className="submissionError">
            {errors.title}
          </p>
        ) : null}
        <input
          id="normalized-title"
          className="adminTextEditor"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-summary">Summary</label>
      </dt>
      <dd>
        {errors.summary ? (
          <p id="normalized-summary-error" className="submissionError">
            {errors.summary}
          </p>
        ) : null}
        <textarea
          id="normalized-summary"
          className="adminTextareaEditor"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-description">Description</label>
      </dt>
      <dd>
        {errors.description ? (
          <p id="normalized-description-error" className="submissionError">
            {errors.description}
          </p>
        ) : null}
        <textarea
          id="normalized-description"
          className="adminTextareaEditor"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-eventType">Event Type</label>
      </dt>
      <dd>
        {errors.eventType ? (
          <p id="normalized-eventType-error" className="submissionError">
            {errors.eventType}
          </p>
        ) : null}
        <select
          className="submissionControl"
          value={eventType}
          onChange={(event) => setEventType(parseEventType(event.target.value))}
          disabled={success}
        >
          <option value="">Select an event type</option>
          {EVENT_TYPES.map((eventType) => (
            <option value={eventType} key={eventType}>
              {formatEventTypeLabel(eventType)}
            </option>
          ))}
        </select>
      </dd>

      <dt>
        <label htmlFor="normalized-event-start">Event Start</label>
      </dt>
      <dd>
        {errors.startTime ? (
          <p id="normalized-event-start-error" className="submissionError">
            {errors.startTime}
          </p>
        ) : null}
        <input
          type="datetime-local"
          className="submissionControl"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-event-end">Event End</label>
      </dt>
      <dd>
        {errors.endTime ? (
          <p id="normalized-event-end-error" className="submissionError">
            {errors.endTime}
          </p>
        ) : null}
        <input
          type="datetime-local"
          className="submissionControl"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-location-name">Location Name</label>
      </dt>
      <dd>
        {errors.locationName ? (
          <p id="normalized-location-name-error" className="submissionError">
            {errors.locationName}
          </p>
        ) : null}
        <input
          id="normalized-location-name"
          className="adminTextEditor"
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-locatton-description">Location Description</label>
      </dt>
      <dd>
        {errors.publicLocationDescription ? (
          <p id="normalized-location-description-error" className="submissionError">
            {errors.publicLocationDescription}
          </p>
        ) : null}
        <input
          id="normalized-location-description"
          className="adminTextEditor"
          value={publicLocationDescription}
          onChange={(event) => setPublicLocationDescription(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>Address</dt>
      <dd>
        <ul className="adminInlineList">
          <li key="addressLine1">
            {errors.addressLine1 ? (
              <p id="normalized-addressLine1-error" className="submissionError">
                {errors.addressLine1}
              </p>
            ) : null}
            <input
              id="normalized-addressLine1"
              className="adminTextEditor"
              value={addressLine1}
              onChange={(event) => setAddressLine1(event.target.value)}
              disabled={success}
            />
          </li>
          <li key="addressLine2">
            {errors.addressLine2 ? (
              <p id="normalized-addressLine2-error" className="submissionError">
                {errors.addressLine2}
              </p>
            ) : null}
            <input
              id="normalized-addressLine2"
              className="adminTextEditor"
              value={addressLine2}
              onChange={(event) => setAddressLine2(event.target.value)}
              disabled={success}
            />
          </li>
        </ul>
      </dd>

      <dt>
        <label htmlFor="normalized-city">City</label>
      </dt>
      <dd>
        {errors.city ? (
          <p id="normalized-city-error" className="submissionError">
            {errors.city}
          </p>
        ) : null}
        <input
          id="normalized-city"
          className="adminTextEditor"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-region">State</label>
      </dt>
      <dd>
        {errors.region ? (
          <p id="normalized-region-error" className="submissionError">
            {errors.region}
          </p>
        ) : null}
        <input
          id="normalized-region"
          className="adminTextEditor"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-country">Country</label>
      </dt>
      <dd>
        {errors.country ? (
          <p id="normalized-country-error" className="submissionError">
            {errors.country}
          </p>
        ) : null}
        <input
          id="normalized-country"
          className="adminTextEditor"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-postalCode">Zip</label>
      </dt>
      <dd>
        {errors.postalCode ? (
          <p id="normalized-postalCode-error" className="submissionError">
            {errors.postalCode}
          </p>
        ) : null}
        <input
          id="normalized-postalCode"
          className="adminTextEditor"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-website">Event Website</label>
      </dt>
      <dd>
        {errors.website ? (
          <p id="normalized-website-error" className="submissionError">
            {errors.website}
          </p>
        ) : null}
        <input
          id="normalized-website"
          className="adminTextEditor"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-contact-email">Event Contact</label>
      </dt>
      <dd>
        {errors.contactEmail ? (
          <p id="normalized-contact-email-error" className="submissionError">
            {errors.contactEmail}
          </p>
        ) : null}
        <input
          id="normalized-contact-email"
          className="adminTextEditor"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>Topics</dt>
      <dd>
        {errors.topicSlugs ? (
          <p id="normalized-topics-error" className="submissionError">
            {errors.topicSlugs}
          </p>
        ) : null}
        {topics.map((topic) => (
          <label className="submissionCheckboxOption" key={topic.slug}>
            <input
              type="checkbox"
              checked={topicSlugs.includes(topic.slug)}
              onChange={() => handleToggle(topic.slug)}
              disabled={success}
            />
            {topic.name}
          </label>
        ))}
      </dd>
    </dl>
  );
}
