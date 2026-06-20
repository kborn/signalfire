'use client';
import { useState } from 'react';
import NavLink from '@/app/navbar';
import { SubmitNavLink } from './submit-nav-link';
import { SearchIcon, MenuIcon, XIcon } from '@/components/icons';

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <div className="site-nav-group">
        <nav className="site-nav" aria-label="Public">
          <NavLink href="/issues">Issues</NavLink>
          <NavLink href="/articles">Articles</NavLink>
          <NavLink href="/actions">Actions</NavLink>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/search" className="site-search-link" aria-label="Search">
            <SearchIcon width={17} height={17} style={{ display: 'block' }} />
          </NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>
        <div className="site-header-actions">
          <SubmitNavLink />
        </div>
      </div>

      <button
        className="site-nav-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <XIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
      </button>

      {open && (
        <nav className="site-nav-drawer" aria-label="Mobile menu">
          <NavLink href="/issues" onClick={close}>
            Issues
          </NavLink>
          <NavLink href="/articles" onClick={close}>
            Articles
          </NavLink>
          <NavLink href="/actions" onClick={close}>
            Actions
          </NavLink>
          <NavLink href="/events" onClick={close}>
            Events
          </NavLink>
          <NavLink href="/search" onClick={close}>
            Search
          </NavLink>
          <NavLink href="/about" onClick={close}>
            About
          </NavLink>
          <SubmitNavLink />
        </nav>
      )}
    </>
  );
}
