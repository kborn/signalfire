import Link from 'next/link';

export default function DemoBanner() {
  return (
    <section className="demoBanner" aria-label="Demo notice">
      <div className="demoBannerBody">
        <p className="demoBannerEyebrow">Demo Site</p>
        <p className="demoBannerCopy">
          Note: the events, actions, and articles here were randomly generated to demonstrate this
          site&apos;s capabilities — none of them are real. A future version will feature properly
          curated content.
        </p>
      </div>
      <div className="demoBannerActions">
        <Link href="/story" className="demoBannerLink">
          The Story
        </Link>
      </div>
    </section>
  );
}
