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
    expect(markup).toContain('Choose an issue. Learn what is at stake. Take one real step.');
  });

  it('renders the primary and secondary discovery links', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('href="/issues"');
    expect(markup).toContain('Explore Issues');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('Why This Site Exists');
    expect(markup).toContain('href="/events"');
    expect(markup).toContain('Search Events');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('Take a concrete step');
    expect(markup).toContain(
      'A civic action guide for people who want a clearer place to start and a more useful way to keep going.',
    );
    expect(markup).toContain('Submit Content');
    expect(markup).toContain('Who This Is For');
  });

  it('renders the issue-first journey and participation sections', () => {
    const markup = renderHomePage();

    expect(markup).toContain('The path is simple.');
    expect(markup).toContain('Choose an issue');
    expect(markup).toContain('Get enough context');
    expect(markup).toContain('Take a concrete step');
    expect(markup).toContain('Articles and events are reviewed before publication');
    expect(markup).toContain(
      'Help other people get involved. Share upcoming events and write articles that inspire someone else to take their first step.',
    );
  });
});
