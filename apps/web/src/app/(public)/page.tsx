import Image from 'next/image';
import Link from 'next/link';
import { isDemoModeEnabled } from '@/lib/demo-mode';

export default function HomePage() {
  const isDemoMode = isDemoModeEnabled();

  return (
    <div className="container home-page">
      <section className="page-section home-hero">
        <div className="hero-logo">
          <Image
            src="/hero.png"
            alt="Find Your Fight visual identity"
            width={1774}
            height={887}
            priority
          />
        </div>

        <p className="section-label">Find Your Fight</p>
        <p className="page-intro">
          Choose one issue, learn what is at stake, and take one concrete step.
        </p>

        <div className="ctaRow">
          <Link href="/topics" className="primaryCTA">
            Explore Issues
          </Link>
          <Link href="/events" className="secondaryCTA">
            Search Events
          </Link>
          <Link href="/about" className="textCTA">
            Why This Site Exists
          </Link>
        </div>
      </section>

      <section className="page-section home-journey">
        <div className="home-sectionHeading">
          <p className="section-label">Start here</p>
          <h2>The path is simple.</h2>
          <p>Start with an issue, build enough context, and move toward action.</p>
        </div>
        <div className="homeJourneyGrid">
          <Link href="/topics" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 1</p>
            <h3 className="collectionItemTitle">Choose an issue</h3>
            <p className="collectionItemSummary">
              Start with the issue that already has your attention. Issue pages anchor the rest of
              the experience.
            </p>
          </Link>
          <Link href="/articles" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 2</p>
            <h3 className="collectionItemTitle">Get enough context</h3>
            <p className="collectionItemSummary">
              Read explainers and background pieces before deciding where your effort belongs.
            </p>
          </Link>
          <Link href="/actions" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 3</p>
            <h3 className="collectionItemTitle">Take a concrete step</h3>
            <p className="collectionItemSummary">
              Move from context into action with practical next steps and nearby event discovery.
            </p>
          </Link>
        </div>
      </section>

      <section className="page-section home-contribute">
        <p className="section-label">Contribute</p>
        <h2>Submissions are moderated before they go live.</h2>
        <p>
          You can submit an article or event for moderation. The contribution flow shows how new
          public content enters the system.
        </p>
        <div className="ctaRow">
          <Link href="/submit" className="primaryCTA">
            Submit Content
          </Link>
          <Link href="/about" className="secondaryCTA">
            Who This Is For
          </Link>
        </div>
      </section>

      {isDemoMode ? (
        <section className="page-section home-demo-path">
          <p className="section-label">Admin access</p>
          <h2>Looking for the admin workspace?</h2>
          <p>
            Use the public <strong>Admin Demo</strong> entry point in the header to inspect the
            moderation and editorial workspace.
          </p>
        </section>
      ) : null}
    </div>
  );
}
