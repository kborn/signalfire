import React from 'react';
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
          You don&apos;t have to be the one who fixes everything. You just have to find the one
          thing that&apos;s already yours — and refuse to let it go. Staying in it, in whatever way
          you can, is itself a form of resistance. Find your fight. Find the part of you that keeps
          showing up.
        </p>
        <div className="heroPosterCTA">
          <Link href="#issue-roll" className="primaryCTA">
            Find yours →
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="page-section home-journey">
        <div className="home-sectionHeading">
          <p className="section-label">The path</p>
          <h2>Three steps. One concrete result.</h2>
          <p>
            Pick one issue. Everything you need to go from knowing to doing is already there. Start
            where you are — not where you think you should be.
          </p>
        </div>
        <div className="homeJourneyGrid">
          <Link href="/issues" className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 1</p>
            <h3 className="collectionItemTitle">Go deep on one issue</h3>
            <p className="collectionItemSummary">
              Issue pages bring together articles, actions, and events around the things that matter
              — everything you need to go from knowing to doing.
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
              It doesn&apos;t have to be big. A call, a donation, showing up to something. Take the
              step that&apos;s actually in reach — the next one gets easier.
            </p>
          </Link>
        </div>
      </section>

      {/* ── Issue roll ── */}
      <section className="page-section home-issues" id="issue-roll">
        <p className="section-label">The issues</p>
        <h2 className="homeIssueQuestion">Choose your fight.</h2>
        {issues.length > 0 && (
          <nav className="heroPosterRoll" aria-label="Browse issues">
            {issues.map((issue) => (
              <Link
                key={issue.slug}
                href={`/issues/${issue.slug}`}
                className="heroPosterIssueLink"
                data-topic={issue.slug}
                style={
                  issue.color
                    ? ({ '--topic-accent': issue.color } as React.CSSProperties)
                    : undefined
                }
              >
                {issue.name}
              </Link>
            ))}
          </nav>
        )}
        <p>
          <Link href="/issues" className="textCTA">
            Browse all issues →
          </Link>
        </p>
      </section>

      {/* ── Contribute ── */}
      <section className="page-section home-contribute">
        <p className="section-label">Contribute</p>
        <h2>If you found yours, help someone else find theirs.</h2>
        <p>
          Have an article, a guide, or a tip about an event worth knowing? Send it in — everything
          gets reviewed before it goes live.
        </p>
        <Link href="/submit" className="primaryCTA">
          Help someone find theirs.
        </Link>
      </section>

      {isDemoMode ? (
        <section className="page-section home-demo-path">
          <p className="section-label">Admin access</p>
          <h2>Looking for the admin workspace?</h2>
          <p>
            Use the <strong>Admin</strong> link in the demo notice above to inspect the moderation
            and editorial workspace.
          </p>
        </section>
      ) : null}
    </div>
  );
}
