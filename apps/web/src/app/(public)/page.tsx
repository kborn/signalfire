import React from 'react';
import Link from 'next/link';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getTopicsList } from '@/lib/api/topics';
import { TopicSummary } from '@/components/topic-summary';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const isDemoMode = isDemoModeEnabled();
  const topicsData = await getTopicsList().catch(() => null);
  const issues = topicsData?.items ?? [];

  return (
    <div className="container home-page motifPage">
      {/* ── Hero ── */}
      <section className="page-section heroPoster">
        <h1 className="heroPosterBrand">Find Your Fight</h1>
        <p className="heroPosterTagline">
          The news doesn&apos;t stop. The problems feel enormous. And most days, it&apos;s easier to
          do nothing than to figure out where to begin.
        </p>
        <div className="heroPosterCTA">
          <Link href="#issue-roll" className="primaryCTA">
            Browse issues →
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
          <div className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 01</p>
            <h3 className="collectionItemTitle">Choose one issue</h3>
            <p className="collectionItemSummary">
              Pick the one that already has your attention. Issue pages bring together everything
              you need — articles, actions, events — in one place.
            </p>
          </div>
          <div className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 02</p>
            <h3 className="collectionItemTitle">Read what matters</h3>
            <p className="collectionItemSummary">
              Explainers and field guides give you enough background to stop feeling stuck and start
              seeing where your effort belongs.
            </p>
          </div>
          <div className="collectionItem homeJourneyCard">
            <p className="collectionItemEyebrow">Step 03</p>
            <h3 className="collectionItemTitle">Do one concrete thing</h3>
            <p className="collectionItemSummary">
              It doesn&apos;t have to be big. A call, a donation, showing up to something. Take the
              step that&apos;s actually in reach — the next one gets easier.
            </p>
          </div>
        </div>
      </section>

      {/* ── Issue roll ── */}
      <section className="page-section home-issues" id="issue-roll">
        <p className="section-label">The issues</p>
        <h2 className="homeIssueQuestion">Choose your fight.</h2>
        {issues.length > 0 && (
          <div className="homeIssueGrid">
            {issues.map((issue) => (
              <TopicSummary key={issue.id} topic={issue} variant="compact" />
            ))}
          </div>
        )}
        <p>
          <Link href="/issues" className="textCTA">
            Browse all issues
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
            <Link href="/admin" className="textCTA">
              Open the admin workspace
            </Link>{' '}
            to inspect the moderation and editorial workflow.
          </p>
        </section>
      ) : null}
    </div>
  );
}
