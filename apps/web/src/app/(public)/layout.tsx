import type { Metadata } from 'next';
import Link from 'next/link';
import NavLink from '@/app/navbar';
import DemoBanner from '@/app/(public)/_components/demo-banner';
import { isDemoModeEnabled } from '@/lib/demo-mode';

export const metadata: Metadata = {
  title: 'Find Your Fight',
  description: 'Focus on the issue that matters most to you, and find a way to act.',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isDemoMode = isDemoModeEnabled();

  return (
    <div className="publicShell">
      <div className="container site-main publicContent">
        <header className="site-header">
          <div className="site-brand-group">
            <Link href="/" className="site-wordmark" aria-label="Find Your Fight home">
              FYF
            </Link>
            {isDemoMode ? <span className="site-demo-indicator">Demo</span> : null}
          </div>
          <div className="site-nav-group">
            <nav className="site-nav" aria-label="Public">
              <NavLink href="/topics">Issues</NavLink>
              <NavLink href="/articles">Articles</NavLink>
              <NavLink href="/actions">Take Action</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
            <div className="site-header-actions">
              {isDemoMode ? (
                <NavLink href="/demo" className="site-admin-demo-link">
                  Admin Demo
                </NavLink>
              ) : null}
              <NavLink href="/submit" className="site-submit-link">
                Submit Content
              </NavLink>
            </div>
          </div>
        </header>
        {isDemoMode ? <DemoBanner /> : null}
        <main>{children}</main>
        <footer className="site-footer">
          <nav className="site-footer-nav" aria-label="Footer">
            <Link href="/topics">Issues</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Take Action</Link>
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
            <Link href="/submit">Submit Content</Link>
          </nav>
          <p className="site-footer-tagline">Find Your Fight — a civic action guide.</p>
        </footer>
      </div>
    </div>
  );
}
