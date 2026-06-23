import Link from 'next/link';
import { SiteNav } from '@/app/(public)/_components/site-nav';
import DemoBanner from '@/app/(public)/_components/demo-banner';
import { isDemoModeEnabled } from '@/lib/demo-mode';

export default function NotFoundPage() {
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
        <main>
          <section className="page-section notFoundPanel">
            <p className="section-label">Page not found</p>
            <h1 className="pageTitle">We could not find that page.</h1>
            <p className="page-intro">
              That page isn&apos;t here. It may not be published yet, or the link may have changed.
              Start from an issue and work your way in.
            </p>
            <div className="ctaRow">
              <Link href="/issues" className="primaryCTA">
                Explore Issues
              </Link>
              <Link href="/actions" className="secondaryCTA">
                Find Actions
              </Link>
            </div>
          </section>
        </main>
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
