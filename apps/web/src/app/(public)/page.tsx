import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container home-page">
      <section className="page-section home-hero">
        <h1 className="pageTitle">Find Your Fight</h1>

        <p className="page-intro">
          The world keeps throwing more at you: another crisis, another headline, another fight that
          matters. If everything feels urgent and you are not sure where to begin, start by choosing
          one issue and one concrete step.
        </p>

        <div className="ctaGroup">
          <Link href="/about" className="textCTA">
            Why This Exists
          </Link>
        </div>
      </section>

      <section className="page-section home-journey">
        <p className="section-label">Choose an issue</p>
        <h2>Start with what matters to you.</h2>

        <p>Explore an issue, understand what is at stake, and choose how to participate.</p>
        <Link href="/topics" className="primaryCTA">
          Explore Issues
        </Link>
      </section>

      <section className="page-section home-participation">
        <p className="section-label">Take the next step</p>
        <h2>Turn focus into action.</h2>

        <p>
          Find practical actions you can take now, or show up where people are already doing the
          work.
        </p>
        <div className="ctaRow">
          <Link href="/actions" className="secondaryCTA">
            Take Action
          </Link>
          <Link href="/events" className="secondaryCTA">
            Find Events
          </Link>
        </div>
      </section>

      <section className="page-section home-philosophy">
        <p className="section-label">Start where you are</p>
        <h2>You cannot fight everything.</h2>
        <p>
          Choosing one fight is not looking away. It is choosing where your effort can become real.
        </p>
        <Link href="/about" className="secondaryCTA">
          Why This Exists
        </Link>
      </section>
    </div>
  );
}
