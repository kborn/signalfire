import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container home-page">
      <section className="page-section home-hero">
        <h1 className="pageTitle">Find Your Fight</h1>

        <p className="page-intro">
          If you are angry, scared, and unsure what to do, start here. Find the issue that matters
          most to you, learn what&#39;s at stake, and take one concrete step. Find your fight, then
          show up for it.
        </p>

        <div className="ctaGroup">
          <Link href="/topics" className="primaryCTA">
            Explore Topics
          </Link>

          <div className="ctaRow">
            <Link href="/articles" className="secondaryCTA">
              Browse Articles
            </Link>
            <Link href="/actions" className="secondaryCTA">
              Browse Actions
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section home-how-it-works">
        <p className="section-label">How it works</p>
        <h2>Learn → Act</h2>

        <p>Explore a topic → Understand the issue → Take meaningful action</p>
      </section>

      <section className="page-section home-philosophy">
        <p className="section-label">Start where you are</p>
        <h2>You do not need to know the whole answer.</h2>
        <p>
          You only need a place to begin. Find the issue that matters most to you, take one concrete
          step, and join the fight for something better.
        </p>
        <Link href="/about" className="secondaryCTA">
          Read why this exists
        </Link>
      </section>
    </div>
  );
}
