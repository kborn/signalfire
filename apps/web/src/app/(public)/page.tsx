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
          The news doesn&apos;t stop. The problems feel enormous. And most days, it&apos;s easy to
          believe there&apos;s nothing one person can do.
        </p>
        <p className="heroPosterSub">
          But every movement that ever changed anything started the same way — with someone who
          found the one fight that was theirs and refused to let go. That fire already exists in
          you. This is where you find it.
        </p>
        {issues.length > 0 && (
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
        )}
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
            <h3 className="collectionItemTitle">Go deep on one issue</h3>
            <p className="collectionItemSummary">
              Your issue page pulls together context, explainers, and organizing opportunities —
              everything you need to move from knowing to doing.
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
