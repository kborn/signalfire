'use client';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';
import { US_STATE_OPTIONS } from '@/lib/us-state-options';

type EventListPageProps = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
};

type EventListPagePropsWrapper = {
  params: EventListPageProps;
  activeDateRangeLabel: string;
};

function buildUrl(queryParams: EventListPageProps) {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      const normalizedValue = value?.trim();

      if (normalizedValue) {
        params.set(key, normalizedValue);
      }
    });
  }

  return params.toString();
}

function parseLocalDateValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function route(router: AppRouterInstance, queryParams: EventListPageProps) {
  const query = buildUrl(queryParams);
  router.replace(query ? `/events?${query}` : '/events');
}

export default function EventFilters({ params, activeDateRangeLabel }: EventListPagePropsWrapper) {
  const router = useRouter();
  const [city, setCity] = useState(params['city'] ?? '');
  const [region, setRegion] = useState(params['region'] ?? '');
  const [startDate, setStartDate] = useState(params['startDate'] ?? '');
  const [endDate, setEndDate] = useState(params['endDate'] ?? '');
  const startDateValue = parseLocalDateValue(startDate);
  const endDateValue = parseLocalDateValue(endDate);
  const dateRangeError =
    startDateValue && endDateValue && endDateValue < startDateValue
      ? 'End date and time must be after the start date and time'
      : null;

  function commitFilters(nextValues?: Partial<EventListPageProps>) {
    const queryParams = {
      topicSlug: params.topicSlug,
      city,
      region,
      startDate,
      endDate,
      ...nextValues,
    };

    const nextStartDate = parseLocalDateValue(queryParams.startDate ?? '');
    const nextEndDate = parseLocalDateValue(queryParams.endDate ?? '');

    if (nextStartDate && nextEndDate && nextEndDate < nextStartDate) {
      return;
    }

    route(router, queryParams);
  }

  return (
    <section className="eventFilterPanel" aria-label="Event filters">
      <div className="eventFilterHeader">
        <p className="eventFilterKicker">Event finder</p>
        <p className="metaText">State is required. City and dates refine the active window.</p>
        <p className="eventFilterWindow">Current date range: {activeDateRangeLabel}</p>
      </div>
      <div className="eventFilterGrid">
        <label className="submissionLabel eventFilterField" htmlFor="event-region">
          <span>State</span>
          <select
            id="event-region"
            className="submissionControl"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            onBlur={() => commitFilters({ region })}
          >
            <option value="">Select a state</option>
            {US_STATE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-city">
          <span>City</span>
          <input
            id="event-city"
            className="submissionControl"
            value={city}
            placeholder="Philadelphia"
            onChange={(event) => setCity(event.target.value)}
            onBlur={() => commitFilters({ city })}
          />
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-start-date">
          <span>Start date and time</span>
          <input
            id="event-start-date"
            className="submissionControl"
            value={startDate}
            type="datetime-local"
            onChange={(event) => setStartDate(event.target.value)}
            onBlur={() => commitFilters({ startDate })}
          />
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-end-date">
          <span>End date and time</span>
          <input
            id="event-end-date"
            className="submissionControl"
            value={endDate}
            type="datetime-local"
            onChange={(event) => setEndDate(event.target.value)}
            onBlur={() => commitFilters({ endDate })}
          />
        </label>
      </div>
      {dateRangeError ? <p className="submissionError">{dateRangeError}</p> : null}
    </section>
  );
}
