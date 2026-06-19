import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import AboutPage from './page';

describe('AboutPage', () => {
  it('renders the focus-to-action journey content', async () => {
    const markup = renderToStaticMarkup(await AboutPage());

    expect(markup).toContain('Find one issue. Learn enough to act. Take the next step.');
    expect(markup).toContain('Choose an issue.');
    expect(markup).toContain('Take one concrete action.');
    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('grounded, credible, and worth acting on.');
  });
});
