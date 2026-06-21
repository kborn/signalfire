import Link from 'next/link';

export default function PublicNotFoundPage() {
  return (
    <section className="page-section notFoundPanel">
      <p className="section-label">Page not found</p>
      <h1 className="pageTitle">We could not find that page.</h1>
      <p className="page-intro">
        That page isn&apos;t here. It may not be published yet, or the link may have changed. Start
        from an issue and work your way in.
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
  );
}
