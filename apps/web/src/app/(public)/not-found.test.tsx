import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PublicNotFoundPage from './not-found';

describe('PublicNotFoundPage', () => {
  it('renders branded public recovery links', () => {
    const markup = renderToStaticMarkup(<PublicNotFoundPage />);

    expect(markup).toContain('Page not found');
    expect(markup).toContain('We could not find that page.');
    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('href="/actions"');
  });
});
