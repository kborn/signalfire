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
  it('renders the homepage heading and manifesto copy', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('Find Your Fight');
    expect(markup).toContain('The news doesn');
    expect(markup).toContain('That fire already exists in you.');
  });

  it('renders the primary navigation CTAs', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('Find yours');
    expect(markup).toContain('href="/submit"');
    expect(markup).toContain('Help someone find theirs');
  });

  it('renders the three-step journey and contribute sections', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('Three steps. One concrete result.');
    expect(markup).toContain('Go deep on one issue');
    expect(markup).toContain('Read what matters');
    expect(markup).toContain('Do one concrete thing');
    expect(markup).toContain('Help more people find a way in.');
  });

  it('renders the issue roll section', async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain('Choose your fight.');
    expect(markup).toContain('id="issue-roll"');
  });
});
