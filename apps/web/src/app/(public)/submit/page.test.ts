import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Contribute to Find Your Fight');
    expect(markup).toContain(
      'Submit an article or event for moderation. Nothing is published automatically.',
    );
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article or Guide');
    expect(markup).toContain(
      'Share explainers, guides, and resource-backed writing that helps someone understand an issue and choose a next step.',
    );
    expect(markup).toContain('Share an Event');
    expect(markup).toContain(
      'Share an upcoming event, rally, meeting, workshop, or volunteer opportunity',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain(
      'Every submission is reviewed by a person before it appears on the site.',
    );
    expect(markup).toContain('Include enough context for moderation and publication preparation.');
    expect(markup).toContain('Read more about the project');
  });
});
