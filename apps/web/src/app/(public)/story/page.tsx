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
        <h1 className="pageTitle">Why Find Your Fight exists</h1>
        <p className="page-intro">
          {/* DRAFT — invented copy, edit freely. */}
          This started as a portfolio project — a way to prove I could build and ship something
          real, end to end. Somewhere along the way, it became something I actually cared about.
        </p>
      </section>

      <section className="page-section about-body stack-md">
        <h2>The story</h2>
        {adminExposed ? (
          <>
            <p>
              {/* DRAFT — invented copy, edit freely. Recruiter/engineering framing. */}
              The stack: a Next.js frontend, a NestJS and Prisma API, a Turborepo monorepo, all
              three services deployed together on Railway — built and shipped solo. I picked Railway
              over a Vercel/Railway split, for instance, because cookie-backed admin sessions would
              have meant fighting cross-origin cookie behavior for no real benefit. The interesting
              parts of this project were never the CRUD screens. They were the pieces that only show
              up once software has to behave like it has real users to protect: an authenticated
              admin surface with server-managed sessions, a moderation queue that has to separate
              good community submissions from bad ones, search and filtering that has to stay fast
              as content grows, a CI/CD pipeline that has to trust its own tests enough to deploy
              without a person watching.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              The content is actually two different problems, not one. Articles and actions need
              real writing and editorial judgment — research, a point of view, fact-checking — and
              there&apos;s no way to make that fast, only real, one piece at a time. Events are a
              different kind of problem: they&apos;re time-sensitive and local, so keeping them
              current really calls for a live sourcing pipeline instead of anything hand-written.
              Neither was the point of the first version — the point was proving the system
              underneath could hold real content once it existed. If I take this further,
              that&apos;s the actual next phase: real writing for one city, and a real events
              pipeline behind it, instead of trying to half-cover the whole country with
              placeholders.
            </p>
          </>
        ) : (
          <>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              The honest answer is the 2024 election. I remember feeling floored by how much felt
              urgent all at once — so much that I didn&apos;t know where to start, and for a while I
              mostly did nothing. It&apos;s hard to act when everything feels equally on fire.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              What actually pulled me out of that wasn&apos;t fixing everything. It was showing up
              to one weekly protest, then another, and realizing I wasn&apos;t the only person who
              felt this way. Being around other people doing something — even something small —
              changed things for me more than any amount of reading the news did. Somewhere in that,
              this project stopped being just a way to practice full-stack development and turned
              into something I actually wanted to exist: a way to hand someone else that same first
              push. You don&apos;t have to fix everything. Pick one issue, do one concrete thing
              about it, and let yourself off the hook for the rest — at least for now.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              What you&apos;re looking at right now is a working demonstration of that idea, not a
              live community yet. If it&apos;s useful to you, I&apos;d like to know —{' '}
              <a href={feedbackMailto} className="inlineLink">
                email me
              </a>{' '}
              and tell me what you think.
            </p>
            <p>
              {/* DRAFT — invented copy, edit freely. */}
              The events, actions, and articles here aren&apos;t real. That&apos;s two different
              reasons, not one. Articles and actions take real writing and judgment, and I&apos;d
              rather do that slowly and for real than fake it. Events are a different problem on top
              of that — time-sensitive, tied to a specific place, and not something I&apos;ve
              figured out how to source for real yet. Neither was the point of this first version.
              The point was finding out whether the idea itself was worth pursuing before solving
              those problems for real.
            </p>
          </>
        )}
      </section>

      {adminExposed ? (
        <section className="page-section about-journey stack-md">
          <h2>Admin workspace access</h2>
          <p>
            {/* DRAFT — invented copy, edit freely. */}
            The admin workspace is where all of this actually gets managed: a moderation queue for
            reviewing community-submitted articles and events before they go live, and simple
            editors for writing and publishing articles, actions, and events directly.
          </p>
          <div className="stack-md">
            <p className="section-label">Default credentials</p>
            <p>
              <strong>Email:</strong> admin@example.com
            </p>
            <p>
              <strong>Password:</strong> FindYourFight1
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
          <p>
            {/* DRAFT — invented copy, edit freely. */}
            Questions?{' '}
            <a href={feedbackMailto} className="inlineLink">
              Email me
            </a>
            .
          </p>
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
