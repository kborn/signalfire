import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NotFoundPage from './not-found';

const originalSiteMode = process.env.NEXT_PUBLIC_SITE_MODE;

vi.mock('next/navigation', () => ({
  usePathname: () => '/does-not-exist',
}));

describe('NotFoundPage', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_MODE = originalSiteMode;
  });

  it('renders the branded shell with an unconditional Story link and no leftover Admin link', () => {
    delete process.env.NEXT_PUBLIC_SITE_MODE;

    const markup = renderToStaticMarkup(<NotFoundPage />);

    expect(markup).toContain('We could not find that page.');
    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('href="/story"');
    expect(markup).toContain(
      `href="mailto:hello@findmyfight.com?subject=${encodeURIComponent('Feedback from Find Your Fight (portfolio)')}"`,
    );
    expect(markup).not.toContain('href="/demo"');
  });

  it('reflects demo mode in the Contact mailto subject', () => {
    process.env.NEXT_PUBLIC_SITE_MODE = 'demo';

    const markup = renderToStaticMarkup(<NotFoundPage />);

    expect(markup).toContain(
      `href="mailto:hello@findmyfight.com?subject=${encodeURIComponent('Feedback from Find Your Fight (demo)')}"`,
    );
  });
});
