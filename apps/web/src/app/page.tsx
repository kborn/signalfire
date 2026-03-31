import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container home-page">
      <section className="page-section home-hero">
        <h1>Learn what matters. Take meaningful action.</h1>

        <p className="page-intro">
          Explore civic issues, understand their impact, and find clear actions you can take.
        </p>

        <div className="home-cta-group">
          <Link href="/topics" className="primaryCTA">
            Explore Topics
          </Link>

          <div className="home-secondary-ctas">
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
    </div>
  );
}
