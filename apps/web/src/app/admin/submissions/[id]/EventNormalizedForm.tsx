'use client';

import { useState } from 'react';

import { EVENT_TYPES, EventType, ModerationSubmissionDetail } from '@signal-fire/api-contracts';

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

function fromDateTimeLocalValue(value: string): string | null {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function parseEventType(value: string): EventType {
  if (EVENT_TYPES.includes(value as EventType)) {
    return value as EventType;
  }

  throw new Error(`Invalid event type: ${value}`);
}

export default function EventNormalizationForm({
  submission,
}: {
  submission: EventModerationSubmission;
}) {
  const [title, setTitle] = useState(submission.submittedContent.title);
  const [summary, setSummary] = useState(submission.submittedContent.summary);
  const [description, setDescription] = useState(submission.submittedContent.description);
  const [eventType, setEventType] = useState<EventType>(submission.submittedContent.eventType);
  const [startTime, setStartTime] = useState(
    toDateTimeLocalValue(submission.submittedContent.startTime),
  );
  const [endTime, setEndTime] = useState(toDateTimeLocalValue(submission.submittedContent.endTime));
  const [locationName, setLocationName] = useState(submission.submittedContent.locationName);
  return (
    <dl className="adminDefinitionList">
      <dt>
        <label htmlFor="normalized-title">Title</label>
      </dt>
      <dd>
        <input
          id="normalized-title"
          className="adminTextEditor"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-summary">Summary</label>
      </dt>
      <dd>
        <textarea
          id="normalized-summary"
          className="adminTextareaEditor"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-description">Description</label>
      </dt>
      <dd>
        <textarea
          id="normalized-description"
          className="adminTextareaEditor"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-eventType">Event Type</label>
      </dt>
      <dd>
        <select
          className="submissionControl"
          value={eventType}
          onChange={(event) => setEventType(parseEventType(event.target.value))}
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
        <input
          type="datetime-local"
          className="submissionControl"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-event-end">End Start</label>
      </dt>
      <dd>
        <input
          type="datetime-local"
          className="submissionControl"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-location-name">Location Name</label>
      </dt>
      <dd>
        <input
          id="normalized-location-name"
          className="adminTextEditor"
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
        />
      </dd>

      <dt>Address</dt>
      <dd>{submission.submittedContent.addressLine1 ?? '--'}</dd>
      <dt>City</dt>
      <dd>{submission.submittedContent.city}</dd>
      <dt>State</dt>
      <dd>{submission.submittedContent.region}</dd>
      <dt>Country</dt>
      <dd>{submission.submittedContent.country}</dd>
      <dt>Zip</dt>
      <dd>{submission.submittedContent.postalCode ?? '--'}</dd>
      <dt>Event Website</dt>
      <dd>{submission.submittedContent.website ?? '--'}</dd>
      <dt>Event Contact</dt>
      <dd>{submission.submittedContent.contactEmail ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}
