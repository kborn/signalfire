import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="page-section">
        <h1>Learn what matters. Take meaningful action.</h1>

        <p>Explore civic issues, understand their impact, and find clear actions you can take.</p>

        <Link href="/topics" className="primaryCTA">
          Explore Topics
        </Link>

        <div>
          <Link href="/articles">Browse Articles</Link>
          <Link href="/actions">Browse Actions</Link>
        </div>
      </section>
      <section>
        <h2>Learn → Act</h2>

        <p>Explore a topic → Understand the issue → Take meaningful action</p>
      </section>
    </div>
  );
}
