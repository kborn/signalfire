import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Contribute to Find Your Fight');
    expect(markup).toContain(
      'Help other people get involved. Share what belongs here, and we will review it before it goes live.',
    );
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article or Guide');
    expect(markup).toContain(
      'Share explainers, guides, and resource-backed writing that helps someone understand an issue and choose a next step.',
    );
    expect(markup).toContain('Share an Event');
    expect(markup).toContain(
      'Share an upcoming event, rally, meeting, workshop, or volunteer opportunity.',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain(
      'Every submission is checked for clarity, fit, and basic verification before it appears on the site.',
    );
    expect(markup).toContain(
      'Strong summaries, accurate links, and enough context for someone else to trust what they are reading.',
    );
    expect(markup).toContain('Read more about the project');
  });
});
