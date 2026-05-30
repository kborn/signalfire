import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Contribute to Find Your Fight');
    expect(markup).toContain(
      'Community submissions help expand this site. Submit an article, resource, or event for moderation review.',
    );
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article or Resource');
    expect(markup).toContain(
      'Submit educational explainers that help people understand an issue, with guides and resources as supporting context for action',
    );
    expect(markup).toContain('Share an Event');
    expect(markup).toContain(
      'Share an upcoming event, rally, meeting, workshop, or volunteer opportunity',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain('Every submission is reviewed before publication.');
  });
});
