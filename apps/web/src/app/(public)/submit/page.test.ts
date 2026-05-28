import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChooseSubmitTypePage from './page';

describe('ChooseSubmitTypePage', () => {
  it('renders article and event submission entry links', async () => {
    const markup = renderToStaticMarkup(ChooseSubmitTypePage());

    expect(markup).toContain('Share a Resource');
    expect(markup).toContain('Submit an article or event for review.');
    expect(markup).toContain('href="/submit/article"');
    expect(markup).toContain('Submit an Article');
    expect(markup).toContain(
      'Share educational or explanatory content that helps others understand an issue',
    );
    expect(markup).toContain('Submit an Event');
    expect(markup).toContain(
      'Share an upcoming event, rally, meeting, workshop, or volunteer opportunity',
    );
    expect(markup).toContain('href="/submit/event"');
    expect(markup).toContain('All submissions are reviewed before publication.');
  });
});
