'use client';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEMO_EVENT_REGION_OPTIONS } from '@/lib/demo-event-region-options';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { US_STATE_OPTIONS } from '@/lib/us-state-options';
import { useDebounce } from '@/components/debounce';
import { CalendarIcon } from '@/components/icons';

type EventListPageProps = {
  topicSlug?: string;
  startDate: string;
  endDate: string;
  city?: string;
  region?: string;
  page?: string;
  pageSize?: string;
};

type EventListPagePropsWrapper = {
  params: EventListPageProps;
};

function buildUrl(params: EventListPageProps) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const normalizedValue = value?.trim();

      if (normalizedValue) {
        searchParams.set(key, normalizedValue);
      }
    });
  }

  return searchParams.toString();
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
      <CalendarIcon />
    </button>
  );
}

export default function EventFilters({ params }: EventListPagePropsWrapper) {
  const router = useRouter();
  const regionOptions = isDemoModeEnabled() ? DEMO_EVENT_REGION_OPTIONS : US_STATE_OPTIONS;
  const [city, setCity] = useState(params['city'] ?? '');
  const startDateInputRef = useRef<DateInputWithPicker | null>(null);
  const endDateInputRef = useRef<DateInputWithPicker | null>(null);
  const startDateValue = parseDateValue(params.startDate);
  const endDateValue = parseDateValue(params.endDate);
  const dateRangeError =
    startDateValue && endDateValue && endDateValue < startDateValue
      ? 'End date must be on or after the start date'
      : null;

  // See decisions.md: "Public Event city filter uses debounced URL commits" (2026-06-16).
  const debouncedCity = useDebounce<string>(city, 700);

  const commitFilters = useCallback(
    (nextValues?: Partial<EventListPageProps>) => {
      const queryParams = {
        ...params,
        ...nextValues,
        page: undefined,
      };

      const nextStartDate = parseDateValue(queryParams.startDate);
      const nextEndDate = parseDateValue(queryParams.endDate);

      if (nextStartDate && nextEndDate && nextEndDate < nextStartDate) {
        return;
      }

      route(router, queryParams);
    },
    [params, router],
  );

  useEffect(() => {
    const normalizedCity = debouncedCity.trim();
    const normalizedParamCity = (params.city ?? '').trim();

    if (normalizedCity === normalizedParamCity) {
      return;
    }

    commitFilters({ city: normalizedCity || undefined });
  }, [debouncedCity, params.city, commitFilters]);

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
          <span>State or territory</span>
          <select
            id="event-region"
            className="submissionControl"
            value={params.region}
            onChange={(event) => {
              commitFilters({ region: event.target.value });
            }}
          >
            <option value="">Select a region</option>
            {regionOptions.map(([value, label]: readonly [string, string]) => (
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
          />
        </label>
        <label className="submissionLabel eventFilterField" htmlFor="event-start-date">
          <span>Start date</span>
          <span className="eventDateControl">
            <input
              id="event-start-date"
              className="submissionControl"
              value={params.startDate}
              type="date"
              ref={startDateInputRef}
              onChange={(event) => {
                commitFilters({ startDate: event.target.value });
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
              value={params.endDate}
              type="date"
              ref={endDateInputRef}
              onChange={(event) => {
                commitFilters({ endDate: event.target.value });
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
