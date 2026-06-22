import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import PublicError from './error';

describe('PublicError', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders recovery actions without exposing raw error details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();

    render(<PublicError error={new Error('Prisma connection refused')} reset={reset} />);

    expect(
      screen.getByRole('heading', { name: 'We could not load this page.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Something blocked us from loading this page. Try again and it should come back.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Prisma connection refused')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument();

    expect(reset).not.toHaveBeenCalled();
  });
});
