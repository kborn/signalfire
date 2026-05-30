import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomePage from './app/(public)/page';

describe('HomePage', () => {
  function renderHomePage() {
    return renderToStaticMarkup(createElement(HomePage));
  }

  it('renders the homepage heading and supporting description', () => {
    const markup = renderHomePage();

    expect(markup).toContain('Find Your Fight');
    expect(markup).toContain(
      'The world keeps throwing more at you: another crisis, another headline, ' +
        'another fight that matters. If everything feels urgent and you are not sure where to begin, ' +
        'start by choosing one issue and one concrete step.',
    );
  });

  it('renders the primary and secondary discovery links', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('href="/topics"');
    expect(markup).toContain('Explore Issues');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('Why This Site Exists');
    expect(markup).toContain('Who This Is For');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('Take Action');
    expect(markup).toContain('href="/events"');
    expect(markup).toContain('Find Events');
  });

  it('renders the issue-first journey and participation sections', () => {
    const markup = renderHomePage();

    expect(markup).toContain('Choose an issue');
    expect(markup).toContain('Start with what matters to you.');
    expect(markup).toContain(
      'Explore an issue, understand what is at stake, and choose how to participate.',
    );
    expect(markup).toContain('Take the next step');
    expect(markup).toContain('Turn focus into action.');
  });
});
