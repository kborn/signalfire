import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/error';

import LoginForm from './LoginForm';

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
}));

describe('LoginForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('routes to the requested admin page after successful login', async () => {
    vi.mocked(login).mockResolvedValue({ ok: true });

    render(<LoginForm next="/admin/articles/community-article" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(login).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith('/admin/articles/community-article');
    });
  });

  it('falls back to admin home when next is missing or unsafe', async () => {
    vi.mocked(login).mockResolvedValue({ ok: true });

    render(<LoginForm next="https://example.com/not-safe" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith('/admin');
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
    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
