'use client';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';

type EventListPageProps = {
  topicSlug?: string;
  startTime?: string;
  endTime?: string;
  city?: string;
  state?: string;
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
  const [state, setState] = useState(params['state'] ?? '');
  const [startTime, setStartTime] = useState(params['startTime'] ?? '');
  const [endTime, setEndTime] = useState(params['endTime'] ?? '');

  return (
    <div>
      <input
        id="event-city"
        className={'submissionControl'}
        value={city}
        placeholder="City"
        onChange={(event) => setCity(event.target.value)}
        onBlur={(event) => route(router, `events?${buildUrl({ ...params, city })}`)}
      />
      <input
        id="event-state"
        className={'submissionControl'}
        value={state}
        placeholder="State"
        onChange={(event) => setState(event.target.value)}
        onBlur={(event) => route(router, `events?${buildUrl({ ...params, state })}`)}
      />
      <label className="submissionLabel" htmlFor="event-startTime">
        <span>Start date and time </span>
        <input
          id="event-startTime"
          className="submissionControl"
          value={startTime}
          type="datetime-local"
          onChange={(event) => setStartTime(event.target.value)}
          onBlur={(event) =>
            route(router, `events?${buildUrl({ ...params, startTime: startTime })}`)
          }
        />
      </label>
      <label className="submissionLabel" htmlFor="event-endTime">
        <span>End date and time </span>
        <input
          id="event-endTime"
          className="submissionControl"
          value={endTime}
          type="datetime-local"
          onChange={(event) => setEndTime(event.target.value)}
          onBlur={(event) => route(router, `events?${buildUrl({ ...params, endTime })}`)}
        />
      </label>
    </div>
  );
}
