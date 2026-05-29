import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import AboutPage from './page';

describe('AboutPage', () => {
  it('renders the closing action panel', async () => {
    const markup = renderToStaticMarkup(await AboutPage());

    expect(markup).toContain('Start where you can');
    expect(markup).toContain('Pick one issue and one next step.');
    expect(markup).toContain('href="/topics"');
    expect(markup).toContain('href="/actions"');
  });
});
