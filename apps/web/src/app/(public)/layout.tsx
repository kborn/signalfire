import type { Metadata } from 'next';
import Link from 'next/link';
import NavLink from '@/app/navbar';

export const metadata: Metadata = {
  title: 'Find Your Fight',
  description: 'Focus on the issue that matters most to you, and find a way to act.',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="publicShell">
      <div className="container site-main publicContent">
        <header className="site-header">
          <Link href="/" className="site-wordmark" aria-label="Find Your Fight home">
            FYF
          </Link>
          <div className="site-nav-group">
            <nav className="site-nav" aria-label="Public">
              <NavLink href="/topics">Issues</NavLink>
              <NavLink href="/articles">Articles</NavLink>
              <NavLink href="/actions">Actions</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
            <NavLink href="/submit" className="site-submit-link">
              Submit Content
            </NavLink>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
