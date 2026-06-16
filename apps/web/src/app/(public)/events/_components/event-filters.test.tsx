import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EventFilters from './event-filters';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
  }),
}));

describe('EventFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('debounces city changes before routing and preserves page size while clearing page', async () => {
    render(
      <EventFilters
        params={{
          region: 'PA',
          city: 'Philadelphia',
          page: '3',
          pageSize: '25',
          startDate: '2026-06-16',
          endDate: '2026-09-16',
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Pittsburgh' } });

    expect(replace).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(699);
    });
    expect(replace).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(replace).toHaveBeenCalledWith(
      '/events?region=PA&city=Pittsburgh&pageSize=25&startDate=2026-06-16&endDate=2026-09-16',
    );
  });

  it('removes city from the URL when the input is cleared', async () => {
    render(
      <EventFilters
        params={{
          region: 'PA',
          city: 'Philadelphia',
          pageSize: '25',
          startDate: '2026-06-16',
          endDate: '2026-09-16',
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText('City'), { target: { value: '' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(replace).toHaveBeenCalledWith(
      '/events?region=PA&pageSize=25&startDate=2026-06-16&endDate=2026-09-16',
    );
  });

  it('limits region options to the supported demo geography', () => {
    render(
      <EventFilters
        params={{
          startDate: '2026-06-16',
          endDate: '2026-09-16',
        }}
      />,
    );

    const options = screen.getAllByRole('option').map((option) => option.textContent);

    expect(options).toEqual([
      'Select a region',
      'New York',
      'Pennsylvania',
      'California',
      'Texas',
      'Puerto Rico',
    ]);
  });
});
