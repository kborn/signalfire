import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h1>Welcome to CivicSignal</h1>
      <p>Learn what matters. Take meaningful action</p>
      <div>
        <Link href="/topics">Browse Topics</Link>
        <Link href="/articles">Read Articles</Link>
        <Link href="/actions">Explore Actions</Link>
      </div>
    </section>
  );
}
