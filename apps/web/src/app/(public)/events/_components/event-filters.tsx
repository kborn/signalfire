'use client';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';

type EventListPageProps = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
};

type EventListPagePropsWrapper = {
  params: EventListPageProps;
};

function buildUrl(queryParams: EventListPageProps) {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });
  }

  return params.toString();
}
function route(router: AppRouterInstance, url: string) {
  router.push(url);
}

export default function EventFilters({ params }: EventListPagePropsWrapper) {
  const router = useRouter();
  const [city, setCity] = useState(params['city'] ?? '');
  const [region, setRegion] = useState(params['region'] ?? '');
  const [startDate, setStartDate] = useState(params['startDate'] ?? '');
  const [endDate, setEndDate] = useState(params['endDate'] ?? '');

  return (
    <div>
      <input
        id="event-city"
        className={'submissionControl'}
        value={city}
        placeholder="City"
        onChange={(event) => setCity(event.target.value)}
        onBlur={() => route(router, `/events?${buildUrl({ ...params, city })}`)}
      />
      <input
        id="event-region"
        className={'submissionControl'}
        value={region}
        placeholder="State"
        onChange={(event) => setRegion(event.target.value)}
        onBlur={() => route(router, `/events?${buildUrl({ ...params, region })}`)}
      />
      <label className="submissionLabel" htmlFor="event-start-date">
        <span>Start date and time </span>
        <input
          id="event-start-date"
          className="submissionControl"
          value={startDate}
          type="datetime-local"
          onChange={(event) => setStartDate(event.target.value)}
          onBlur={() => route(router, `/events?${buildUrl({ ...params, startDate })}`)}
        />
      </label>
      <label className="submissionLabel" htmlFor="event-end-date">
        <span>End date and time </span>
        <input
          id="event-end-date"
          className="submissionControl"
          value={endDate}
          type="datetime-local"
          onChange={(event) => setEndDate(event.target.value)}
          onBlur={() => route(router, `/events?${buildUrl({ ...params, endDate })}`)}
        />
      </label>
    </div>
  );
}
