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
  initialStartDate: string;
  initialEndDate: string;
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

function parseDateValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  return new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
}

function route(router: AppRouterInstance, queryParams: EventListPageProps) {
  const query = buildUrl(queryParams);
  router.replace(query ? `/events?${query}` : '/events');
}

export default function EventFilters({
  params,
  initialStartDate,
  initialEndDate,
}: EventListPagePropsWrapper) {
  const router = useRouter();
  const [city, setCity] = useState(params['city'] ?? '');
  const [region, setRegion] = useState(params['region'] ?? '');
  const [startDate, setStartDate] = useState(params['startDate'] ?? initialStartDate);
  const [endDate, setEndDate] = useState(params['endDate'] ?? initialEndDate);
  const startDateValue = parseDateValue(startDate);
  const endDateValue = parseDateValue(endDate);
  const dateRangeError =
    startDateValue && endDateValue && endDateValue < startDateValue
      ? 'End date must be on or after the start date'
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

    const nextStartDate = parseDateValue(queryParams.startDate ?? '');
    const nextEndDate = parseDateValue(queryParams.endDate ?? '');

    if (nextStartDate && nextEndDate && nextEndDate < nextStartDate) {
      return;
    }

    route(router, queryParams);
  }

  return (
    <section className="eventFilterPanel" aria-label="Event filters">
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
            placeholder="City"
            onChange={(event) => setCity(event.target.value)}
            onBlur={() => commitFilters({ city })}
          />
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-start-date">
          <span>Start date</span>
          <input
            id="event-start-date"
            className="submissionControl"
            value={startDate}
            type="date"
            onChange={(event) => {
              const nextStartDate = event.target.value;
              setStartDate(nextStartDate);
              commitFilters({ startDate: nextStartDate });
            }}
          />
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-end-date">
          <span>End date</span>
          <input
            id="event-end-date"
            className="submissionControl"
            value={endDate}
            type="date"
            onChange={(event) => {
              const nextEndDate = event.target.value;
              setEndDate(nextEndDate);
              commitFilters({ endDate: nextEndDate });
            }}
          />
        </label>
      </div>
      {dateRangeError ? <p className="submissionError">{dateRangeError}</p> : null}
    </section>
  );
}
