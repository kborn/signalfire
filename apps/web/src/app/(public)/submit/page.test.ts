import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Share what you know.');
    expect(markup).toContain(
      'If you know of an article, an event, or a resource that belongs here, send it. Everything gets reviewed before it goes live.',
    );
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article or Guide');
    expect(markup).toContain(
      'Share explainers, guides, and resource-backed writing that helps someone understand an issue and choose a next step.',
    );
    expect(markup).toContain('Share an Event');
    expect(markup).toContain(
      'Know about a rally, town hall, workshop, or volunteer shift someone should be at? Put it here.',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain(
      'A real person reviews every submission before it appears on the site.',
    );
    expect(markup).toContain(
      'Strong summaries, accurate links, and enough context for someone else to trust what they are reading.',
    );
    expect(markup).toContain('Read more about the project');
  });
});
