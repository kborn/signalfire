import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Contribute to Find Your Fight');
    expect(markup).toContain(
      'Community submissions are the primary source of new content on this site. Submit an article, guide, resource, or event for moderation review.',
    );
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article or Guide');
    expect(markup).toContain(
      'Submit explainers, guides, and resource-backed articles that help people understand an issue and choose a concrete next step.',
    );
    expect(markup).toContain('Share an Event');
    expect(markup).toContain(
      'Share an upcoming event, rally, meeting, workshop, or volunteer opportunity',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain(
      'Every submission is reviewed before publication to keep community contributions useful and credible.',
    );
  });
});
