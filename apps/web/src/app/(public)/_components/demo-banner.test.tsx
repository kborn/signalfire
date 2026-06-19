import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';

import DemoBanner from './demo-banner';

describe('DemoBanner', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the demo notice by default', () => {
    render(<DemoBanner />);

    expect(screen.getByText('Demo Site')).toBeInTheDocument();
    expect(screen.getByText('This is a demo site with sample content.')).toBeInTheDocument();
  });

  it('persists dismissal in sessionStorage', () => {
    render(<DemoBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.getByText('Demo Site')).toBeInTheDocument();
    expect(screen.getByLabelText('Demo notice')).toHaveClass('demoBannerClosing');

    act(() => {
      vi.advanceTimersByTime(320);
    });

    expect(window.sessionStorage.getItem('fyf-demo-banner-dismissed')).toBe('1');
    expect(screen.queryByText('Demo Site')).not.toBeInTheDocument();
  });
});
