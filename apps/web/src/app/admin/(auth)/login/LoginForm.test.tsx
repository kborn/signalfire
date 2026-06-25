import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/error';

import LoginForm from './LoginForm';

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
}));

describe('LoginForm', () => {
  let locationHref: string;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE = 'true';
    locationHref = '';
    vi.stubGlobal('location', {
      get href() {
        return locationHref;
      },
      set href(value: string) {
        locationHref = value;
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE;
  });

  it('routes to the requested admin page after successful login', async () => {
    vi.mocked(login).mockResolvedValue({ ok: true });

    render(<LoginForm next="/admin/articles/community-article" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'FindYourFight1');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(login).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'FindYourFight1',
    });

    await waitFor(() => {
      expect(locationHref).toBe('/admin/articles/community-article');
    });
  });

  it('falls back to admin home when next is missing or unsafe', async () => {
    vi.mocked(login).mockResolvedValue({ ok: true });

    render(<LoginForm next="https://example.com/not-safe" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'FindYourFight1');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(locationHref).toBe('/admin');
    });
  });

  it('shows an invalid credentials message for unauthorized logins', async () => {
    vi.mocked(login).mockRejectedValue(new ApiError('Unauthorized', 401, 'admin/auth/login'));

    render(<LoginForm next="/admin" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'bad-password');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Unable to sign in')).toBeInTheDocument();
    expect(
      screen.getByText('Invalid admin credentials. Check your email and password and try again.'),
    ).toBeInTheDocument();
    expect(locationHref).toBe('');
  });

  it('shows the demo credentials guidance link on the default login view', () => {
    render(<LoginForm next={null} />);

    expect(screen.getByText('demo review and admin access section')).toHaveAttribute(
      'href',
      'https://github.com/kborn/signalfire#demo-review-and-admin-access',
    );
  });
});
