import Link from 'next/link';
import { headers } from 'next/headers';
import { isAdminExposed } from '@/lib/site-mode';

export const metadata = {
  title: 'The Story Behind This Site — Find Your Fight',
  description: 'Why this site exists, and what it runs on.',
};

export default async function StoryPage() {
  const adminExposed = isAdminExposed();
  const host = (await headers()).get('host') ?? 'findmyfight.com';
  const feedbackMailto = `mailto:hello@findmyfight.com?subject=${encodeURIComponent(`Feedback from ${host}`)}`;

  return (
    <section className="page-section demoPage motifPage centeredPublicPage">
      <section className="page-section about-hero">
        <p className="section-label">The Story</p>
        <h1 className="pageTitle">Why this exists</h1>
        <p className="page-intro">
          This isn&apos;t a company product or a client project — it&apos;s one person&apos;s site,
          built and shipped solo.
        </p>
      </section>

      <section className="page-section about-body stack-md">
        <h2>Why I built this</h2>
        {adminExposed ? (
          <>
            <p>
              {/* DRAFT — invented copy, edit freely. Recruiter/engineering framing. */}
              This project started as a way to learn full-stack product development end to end: a
              Next.js frontend, a NestJS and Prisma API, a Turborepo monorepo, and a Railway
              deployment, built and shipped solo. It covers the parts of the job that don&apos;t
              show up in a toy app — authenticated admin workflows, a moderation queue, submission
              review, search and filtering, and CI/CD.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              The content is seeded, not real, by design. Writing and vetting a real event calendar
              is a content-sourcing problem, not an engineering one, and solving it wasn&apos;t the
              point of this build — the point was the full-stack system underneath it. If I take
              this further, the plan is to pick one launch city and get that right before trying to
              cover more ground.
            </p>
            <p>
              If you want to see the editorial and moderation tooling directly, admin access is
              below.
            </p>
          </>
        ) : (
          <>
            <p>
              {/* DRAFT — invented copy, edit freely. General-reader framing. */}
              Find Your Fight is built around three steps: choose one issue, read what matters, do
              one concrete thing. Building this site became that one thing for me — and now I&apos;m
              wondering if helping other people find theirs is a way to keep doing it. What
              you&apos;re looking at right now is a working demonstration of that idea, not a live
              community yet. If it&apos;s useful to you, I&apos;d like to know —{' '}
              <a href={feedbackMailto} className="inlineLink">
                email me
              </a>{' '}
              and tell me what you think.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              The events, actions, and articles here are randomly generated, not real. Writing and
              vetting real content for an entire country is more than one person can do well, and it
              wasn&apos;t the point yet — I wanted to demonstrate what the site can do and find out
              if it&apos;s actually useful before solving the content problem for real. Finding real
              events is solvable. If I take this further, the plan is to pick one city and get that
              right, rather than half-cover the whole country before anyone knows the site exists.
            </p>
          </>
        )}
      </section>

      {adminExposed ? (
        <section className="page-section about-journey stack-md">
          <h2>Admin workspace access</h2>
          <p>
            The admin workspace includes the moderation queue, submission review, and article,
            action, and event editors.
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
              Credentials may differ if this instance was deployed with custom environment
              variables. Check the README for environment setup.
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
        </section>
      ) : null}

      <section className="page-section about-community stack-md">
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
      </section>
    </section>
  );
}
