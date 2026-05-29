import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PublicNotFoundPage from './not-found';

describe('PublicNotFoundPage', () => {
  it('renders branded public recovery links', () => {
    const markup = renderToStaticMarkup(<PublicNotFoundPage />);

    expect(markup).toContain('Page not found');
    expect(markup).toContain('This path does not have a fight attached.');
    expect(markup).toContain('href="/topics"');
    expect(markup).toContain('href="/actions"');
  });
});
