import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NavLink from './nav-link';

const usePathnameMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

describe('NavLink', () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  it('marks the home link current only on the root route', () => {
    usePathnameMock.mockReturnValue('/');

    const markup = renderToStaticMarkup(<NavLink href="/">Home</NavLink>);

    expect(markup).toContain('aria-current="page"');
  });

  it('does not mark the home link current on non-root routes', () => {
    usePathnameMock.mockReturnValue('/issues');

    const markup = renderToStaticMarkup(<NavLink href="/">Home</NavLink>);

    expect(markup).not.toContain('aria-current="page"');
  });

  it('marks a section link current on its collection and detail routes', () => {
    usePathnameMock.mockReturnValue('/issues/climate');

    const markup = renderToStaticMarkup(<NavLink href="/issues">Topics</NavLink>);

    expect(markup).toContain('aria-current="page"');
  });

  it('does not mark a section link current for a plain prefix collision', () => {
    usePathnameMock.mockReturnValue('/issueship');

    const markup = renderToStaticMarkup(<NavLink href="/issues">Topics</NavLink>);

    expect(markup).not.toContain('aria-current="page"');
  });
});
