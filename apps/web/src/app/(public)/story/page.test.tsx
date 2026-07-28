import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StoryPage from './page';

const originalSiteMode = process.env.NEXT_PUBLIC_SITE_MODE;

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (key: string) => (key === 'host' ? 'story-test.findmyfight.com' : null),
  })),
}));

describe('StoryPage', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_MODE = originalSiteMode;
  });

  it('shows the admin-access section and credentials in portfolio mode', async () => {
    process.env.NEXT_PUBLIC_SITE_MODE = 'portfolio';

    const markup = renderToStaticMarkup(await StoryPage());

    expect(markup).toContain('Admin workspace access');
    expect(markup).toContain('admin@example.com');
    expect(markup).toContain('FindYourFight1');
    expect(markup).toContain('href="/admin"');
    expect(markup).not.toContain('Shortly after the 2025 inauguration');
  });

  it('omits admin content and shows the general-reader story in demo mode', async () => {
    process.env.NEXT_PUBLIC_SITE_MODE = 'demo';

    const markup = renderToStaticMarkup(await StoryPage());

    expect(markup).not.toContain('Admin workspace access');
    expect(markup).not.toContain('admin@example.com');
    expect(markup).not.toContain('href="/admin"');
    expect(markup).toContain('Shortly after the 2025 inauguration');
    expect(markup).toContain('Kevin Born');
  });

  it('builds the feedback mailto subject from the request host', async () => {
    process.env.NEXT_PUBLIC_SITE_MODE = 'demo';

    const markup = renderToStaticMarkup(await StoryPage());

    expect(markup).toContain(
      `href="mailto:hello@findmyfight.com?subject=${encodeURIComponent('Feedback from story-test.findmyfight.com')}"`,
    );
  });
});
