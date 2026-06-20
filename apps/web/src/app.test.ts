import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/server', () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn().mockResolvedValue({ items: [] }),
}));

vi.mock('@/lib/demo-mode', () => ({
  isDemoModeEnabled: vi.fn().mockReturnValue(false),
}));

import HomePage from './app/(public)/page';

describe('HomePage', () => {
  it('renders the homepage heading and supporting description', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('Find Your Fight');
    expect(markup).toContain(
      'For people who care, want to do something real, and need a clear place to start.',
    );
  });

  it('renders the primary navigation CTAs', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('Browse Issues');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('How it works');
    expect(markup).toContain('href="/submit"');
    expect(markup).toContain('Submit Content');
  });

  it('renders the three-step journey and contribute sections', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('Three steps. One concrete result.');
    expect(markup).toContain('Pick an issue');
    expect(markup).toContain('Read what matters');
    expect(markup).toContain('Do one concrete thing');
    expect(markup).toContain('Help more people find a way in.');
  });
});
