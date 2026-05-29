import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ErrorPage from './error';

describe('Root ErrorPage', () => {
  it('uses stable recovery copy and reset action without exposing raw error text', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error('internal stack details')} reset={reset} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred while loading this page.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('internal stack details')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
