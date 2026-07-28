import Link from 'next/link';
import { SiteNav } from '@/app/(public)/_components/site-nav';
import DemoBanner from '@/app/(public)/_components/demo-banner';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getSiteMode } from '@/lib/site-mode';

export default function NotFoundPage() {
  const isDemoMode = isDemoModeEnabled();
  const contactMailto = `mailto:hello@findmyfight.com?subject=${encodeURIComponent(`Feedback from Find Your Fight (${getSiteMode()})`)}`;

  return (
    <div className="publicShell">
      <div className="container site-main publicContent">
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
          {isDemoMode ? <DemoBanner /> : null}
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
        <footer className="site-footer">
          <nav className="site-footer-nav" aria-label="Footer">
            <Link href="/issues">Issues</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Actions</Link>
            <Link href="/events">Events</Link>
            <Link href="/search">Search</Link>
            <Link href="/about">About</Link>
            <Link href="/submit">Contribute</Link>
            <Link href="/story">Story</Link>
            <a href={contactMailto}>Contact</a>
          </nav>
          <p className="site-footer-tagline">Find Your Fight — a civic action guide.</p>
        </footer>
      </div>
    </div>
  );
}
