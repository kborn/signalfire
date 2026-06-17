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
      'Choose one issue, learn what is at stake, and take one concrete step.',
    );
  });

  it('renders the primary and secondary discovery links', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('href="/topics"');
    expect(markup).toContain('Explore Issues');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('Why This Site Exists');
    expect(markup).toContain('href="/events"');
    expect(markup).toContain('Search Events');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('Take a concrete step');
    expect(markup).toContain('Submit Content');
    expect(markup).toContain('Who This Is For');
  });

  it('renders the issue-first journey and participation sections', () => {
    const markup = renderHomePage();

    expect(markup).toContain('The path is simple.');
    expect(markup).toContain('Choose an issue');
    expect(markup).toContain('Get enough context');
    expect(markup).toContain('Take a concrete step');
    expect(markup).toContain('Submissions are moderated before they go live.');
  });
});
