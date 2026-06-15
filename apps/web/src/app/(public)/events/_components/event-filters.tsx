'use client';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRef, useState } from 'react';
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

type DateInputWithPicker = HTMLInputElement & {
  showPicker?: () => void;
};

function CalendarGlyph({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="eventDateIcon" aria-label="Open date picker" onClick={onClick}>
      <svg viewBox="0 0 24 24" focusable="false">
        <path
          d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
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
  const startDateInputRef = useRef<DateInputWithPicker | null>(null);
  const endDateInputRef = useRef<DateInputWithPicker | null>(null);
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

  function openDatePicker(input: DateInputWithPicker | null) {
    if (!input) {
      return;
    }

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
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
            onChange={(event) => {
              const nextRegion = event.target.value;
              setRegion(nextRegion);
              commitFilters({ region: nextRegion });
            }}
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
          <span className="eventDateControl">
            <input
              id="event-start-date"
              className="submissionControl"
              value={startDate}
              type="date"
              ref={startDateInputRef}
              onChange={(event) => {
                const nextStartDate = event.target.value;
                setStartDate(nextStartDate);
                commitFilters({ startDate: nextStartDate });
              }}
            />
            <CalendarGlyph onClick={() => openDatePicker(startDateInputRef.current)} />
          </span>
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-end-date">
          <span>End date</span>
          <span className="eventDateControl">
            <input
              id="event-end-date"
              className="submissionControl"
              value={endDate}
              type="date"
              ref={endDateInputRef}
              onChange={(event) => {
                const nextEndDate = event.target.value;
                setEndDate(nextEndDate);
                commitFilters({ endDate: nextEndDate });
              }}
            />
            <CalendarGlyph onClick={() => openDatePicker(endDateInputRef.current)} />
          </span>
        </label>
      </div>
      {dateRangeError ? <p className="submissionError">{dateRangeError}</p> : null}
    </section>
  );
}
