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
      'The world demands your attention from every direction. Focus on the issue that matters\n' +
        '          most to you, and find a way to act.',
    );
  });

  it('renders the primary and secondary discovery links', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('href="/topics"');
    expect(markup).toContain('Explore Topics');
    expect(markup).toContain('href="/articles"');
    expect(markup).toContain('Browse Articles');
    expect(markup).toContain('href="/actions"');
    expect(markup).toContain('Browse Actions');
  });

  it('renders the learn-to-act explainer section', () => {
    const markup = renderHomePage();

    expect(markup).toContain('How it works');
    expect(markup).toContain('Learn → Act');
    expect(markup).toContain('Explore a topic → Understand the issue → Take meaningful action');
  });

  it('does not advertise event discovery on the phase 6 home page', () => {
    const markup = renderHomePage();

    expect(markup).not.toContain('href="/events"');
    expect(markup).not.toContain('Browse Events');
  });
});
