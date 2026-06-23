import type { Metadata } from 'next';
import Link from 'next/link';
import DemoBanner from '@/app/(public)/_components/demo-banner';
import { SiteNav } from '@/app/(public)/_components/site-nav';
import { isDemoModeEnabled } from '@/lib/demo-mode';

export const metadata: Metadata = {
  title: 'Find Your Fight',
  description: 'Focus on the issue that matters most to you, and find a way to act.',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isDemoMode = isDemoModeEnabled();

  return (
    <div className="publicShell">
      <div className="container site-main publicContent" data-demo={isDemoMode ? '' : undefined}>
        <div className="site-sticky-area">
          <header className="site-header">
            <div className="site-brand-group">
              <Link href="/" className="site-wordmark" aria-label="Find Your Fight home">
                <span className="site-wordmark-text" aria-hidden="true">
                  Find Your Fight
                </span>
              </Link>
            </div>
            <SiteNav />
          </header>
        </div>
        <main>{children}</main>
        {isDemoMode ? <DemoBanner /> : null}
        <footer className="site-footer">
          <nav className="site-footer-nav" aria-label="Footer">
            <Link href="/issues">Issues</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Actions</Link>
            <Link href="/events">Events</Link>
            <Link href="/search">Search</Link>
            <Link href="/about">About</Link>
            <Link href="/submit">Contribute</Link>
            {isDemoMode && <Link href="/demo">Admin</Link>}
          </nav>
          <p className="site-footer-tagline">Find Your Fight — a civic action guide.</p>
        </footer>
      </div>
    </div>
  );
}
