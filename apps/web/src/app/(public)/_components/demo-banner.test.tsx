import { cleanup, render, screen } from '@testing-library/react';
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

    expect(screen.getByRole('link', { name: 'The Story' })).toHaveAttribute('href', '/story');
  });
});
