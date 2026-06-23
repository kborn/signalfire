import Link from 'next/link';

export const metadata = {
  title: 'Demo — Find Your Fight',
  description: 'Portfolio demo information and admin access for Find Your Fight.',
};

export default function DemoPage() {
  return (
    <section className="page-section demoPage motifPage centeredPublicPage">
      <div className="page-section about-hero">
        <p className="section-label">Portfolio demo</p>
        <h1 className="pageTitle">About This Demo</h1>
        <p className="page-intro">
          Find Your Fight is a portfolio project. This site runs on seeded demo content and is not a
          live civic platform.
        </p>
      </div>

      <div className="page-section about-body stack-md">
        <h2>What you are looking at</h2>
        <p>
          This demo shows a working civic action platform — public browsing, content filtering,
          event discovery, article and event submission, and a full moderation and editorial admin
          workspace.
        </p>
        <p>
          All content is seeded for demonstration purposes. Submitted articles and events enter a
          real moderation queue and can be reviewed through the admin workspace.
        </p>
      </div>

      <div className="page-section about-journey stack-md">
        <h2>Admin workspace access</h2>
        <p>
          The admin workspace includes the moderation queue, submission review, and article, action,
          and event editors.
        </p>
        <div className="stack-md">
          <p className="section-label">Default demo credentials</p>
          <p>
            <strong>Email:</strong> admin@example.com
          </p>
          <p>
            <strong>Password:</strong> FindYourFight1
          </p>
          <p className="metaText">
            Credentials may differ if this instance was deployed with custom environment variables.
            Check the README for environment setup.
          </p>
        </div>
        <div className="ctaRow">
          <Link href="/admin" className="primaryCTA">
            Go to Admin
          </Link>
          <Link
            href="https://github.com/kborn/signalfire"
            className="secondaryCTA"
            target="_blank"
            rel="noreferrer"
          >
            View Repository
          </Link>
        </div>
      </div>

      <div className="page-section about-community stack-md">
        <p className="section-label">Explore the public site</p>
        <h2>Start with the public experience</h2>
        <div className="ctaRow">
          <Link href="/issues" className="secondaryCTA">
            Browse Issues
          </Link>
          <Link href="/articles" className="secondaryCTA">
            Read Articles
          </Link>
          <Link href="/actions" className="secondaryCTA">
            Take Action
          </Link>
          <Link href="/events" className="secondaryCTA">
            Find Events
          </Link>
        </div>
      </div>
    </section>
  );
}
