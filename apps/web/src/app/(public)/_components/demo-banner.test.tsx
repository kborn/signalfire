import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import DemoBanner from './demo-banner';

describe('DemoBanner', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the demo notice', () => {
    render(<DemoBanner />);

    expect(screen.getByText('Demo Site')).toBeInTheDocument();
    expect(screen.getByText(/Note: the events, actions, and articles here/)).toBeInTheDocument();
  });

  it('links to the story page', () => {
    render(<DemoBanner />);

    expect(screen.getByRole('link', { name: 'Read the full story.' })).toHaveAttribute(
      'href',
      '/story',
    );
  });

  it('dismisses when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoBanner />);

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    await waitFor(() => {
      expect(screen.queryByText('Demo Site')).not.toBeInTheDocument();
    });
  });
});
