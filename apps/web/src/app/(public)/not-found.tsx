import Link from 'next/link';

export default function PublicNotFoundPage() {
  return (
    <section className="page-section notFoundPanel">
      <p className="section-label">Page not found</p>
      <h1 className="pageTitle">This path does not have a fight attached.</h1>
      <p className="page-intro">
        The page may have moved, or the resource may not be published yet. Start with the current
        issue areas or browse practical ways to act.
      </p>
      <div className="ctaRow">
        <Link href="/topics" className="primaryCTA">
          Explore Issues
        </Link>
        <Link href="/actions" className="secondaryCTA">
          Find Actions
        </Link>
      </div>
    </section>
  );
}
