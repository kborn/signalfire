import Link from 'next/link';
import { connection } from 'next/server';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getTopicsList } from '@/lib/api/topics';

export const revalidate = 60;

export default async function HomePage() {
  await connection();
  const isDemoMode = isDemoModeEnabled();
  const topicsData = await getTopicsList().catch(() => null);
  const issues = topicsData?.items ?? [];

  return (
    <div className="container home-page motifPage">
      {/* ── Hero ── */}
      <section className="page-section heroPoster">
        <h1 className="heroPosterBrand">Find Your Fight</h1>
        <p className="heroPosterTagline">
          For people who care, want to do something real, and need a clear place to start.
        </p>
        <p className="heroPosterSub">
          You don&apos;t have to carry every issue. Pick the one that already has your attention —
          and find your way in.
        </p>
        <div className="ctaRow heroPosterCTA">
          <Link href="/issues" className="primaryCTA">
            Browse Issues
          </Link>
          <Link href="/about" className="secondaryCTA">
            How it works
          </Link>
        </div>
      </section>

      {/* ── Issue browser ── */}
      <section className="page-section home-issues">
        <div className="home-sectionHeading">
          <p className="section-label">The issues</p>
          <h2 className="homeIssueQuestion">Which one is yours?</h2>
          <p>
            Start with the one you already can&apos;t stop thinking about. You don&apos;t need to
            solve all of them.
          </p>
        </div>
        {issues.length > 0 ? (
          <>
            <nav className="heroPosterRoll" aria-label="Browse issues">
              {issues.map((issue) => (
                <Link
                  key={issue.slug}
                  href={`/issues/${issue.slug}`}
                  className="heroPosterIssueLink"
                  data-topic={issue.slug}
                >
                  {issue.name}
                </Link>
              ))}
            </nav>
            <p className="heroPosterFooter">
              <Link href="/issues" className="textCTA">
                Browse all issues
              </Link>
            </p>
          </>
        ) : null}
      </section>

      {/* ── How it works ── */}
      <section className="page-section home-journey">
        <div className="home-sectionHeading">
          <p className="section-label">The path</p>
          <h2>Three steps. One concrete result.</h2>
          <p>
            Every issue page connects you to explainers, actions, and events. Start where you are —
            not where you think you should be.
          </p>
        </div>
        <div className="homeJourneyGrid">
          <Link href="/issues" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 1</p>
            <h3 className="collectionItemTitle">Pick an issue</h3>
            <p className="collectionItemSummary">
              One issue. The one that already bothers you. You don&apos;t need to care about all of
              them — just start with one.
            </p>
          </Link>
          <Link href="/articles" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 2</p>
            <h3 className="collectionItemTitle">Read what matters</h3>
            <p className="collectionItemSummary">
              Explainers and field guides give you enough background to stop feeling stuck and start
              seeing where your effort belongs.
            </p>
          </Link>
          <Link href="/actions" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 3</p>
            <h3 className="collectionItemTitle">Do one concrete thing</h3>
            <p className="collectionItemSummary">
              A contact. A donation. A volunteer slot. An event nearby. One step is enough to begin
              — and beginning changes everything.
            </p>
          </Link>
        </div>
      </section>

      {/* ── Contribute ── */}
      <section className="page-section home-contribute">
        <p className="section-label">Contribute</p>
        <h2>Help more people find a way in.</h2>
        <p>
          Know of an event, a resource, or an issue worth covering? Submissions are reviewed before
          publication so the experience stays clear and worth returning to.
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
            Use the <strong>Admin Demo</strong> link in the header to inspect the moderation and
            editorial workspace.
          </p>
        </section>
      ) : null}
    </div>
  );
}
