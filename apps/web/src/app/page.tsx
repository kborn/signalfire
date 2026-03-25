import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h1>Learn what matters. Take meaningful action.</h1>
      <p>Explore civic issues, understand their impact, and find clear actions you can take.</p>
      <div>
        <Link href="/topics">Browse Topics</Link>
        <Link href="/articles">Read Articles</Link>
        <Link href="/actions">Explore Actions</Link>
      </div>
    </section>
  );
}
