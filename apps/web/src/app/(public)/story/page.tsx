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
          This started as a portfolio project: a way to learn web frameworks and to prove I could
          build and ship something real, end to end. Somewhere along the way, it became something I
          actually cared about.
        </p>
      </section>

      <section className="page-section about-body stack-md">
        <h2>I found my fight.</h2>
        {adminExposed ? (
          <>
            <p>
              The goal was proving I could learn a full stack well enough to architect, build and
              deploy it entirely on my own. The stack: a Next.js frontend, a NestJS and Prisma API,
              a Turborepo monorepo, all three services deployed together on Railway. I picked
              Railway over a Vercel/Railway split because cookie-backed admin sessions would have
              meant fighting cross-origin cookie behavior for no real benefit. The interesting parts
              of this project were never the CRUD screens. They were the pieces that only show up
              once software has to behave like it has real users to protect. The admin surface runs
              on server-managed sessions — a signed, httpOnly cookie backed by a real session table,
              not a JWT sitting in a browser&apos;s localStorage — so a session can be revoked or
              expired without trusting the client to behave itself. Community submissions don&apos;t
              go live directly: they sit in a moderation queue until an editor approves one into a
              real article or event, or rejects it with a note back to whoever submitted it. Search
              and filtering has to work across a growing library of issues, articles, actions, and
              events, kept simple for now with room to swap in something more sophisticated once
              there&apos;s real content to search. And a CI pipeline gates every merge on lint, a
              full type check, the complete test suite, and a dependency audit — nothing reaches{' '}
              <code>main</code> without clearing all four.
            </p>
            <p>
              The result is a fully working system running on placeholder content, not a finished
              product. Writing the real content wouldn&apos;t have proven anything the architecture
              doesn&apos;t already, so I left it for later rather than building it first. Sourcing,
              validating and keeping an events calendar current is a genuinely interesting
              engineering problem, and one I&apos;m already comfortable with — building it out here
              wouldn&apos;t have taught me anything new. Real articles and actions are a different
              kind of dependency: they need a community of local writers and organizers that
              doesn&apos;t exist yet, and that&apos;s not something I can build alone. I&apos;d like
              this to become real one day. Right now, I&apos;m using this version to gauge interest
              before taking on that work.
            </p>
          </>
        ) : (
          <>
            <p>
              Shortly after the 2025 inauguration, my brain went into a kind of panic mode: mind
              racing, catastrophizing and completely unable to shake it. I think a lot of people
              felt some version of that, even if less intensely.
            </p>
            <p>
              What pulled me out of that wasn&apos;t fixing everything. It was showing up to one
              weekly protest, then another, and realizing I wasn&apos;t the only person who felt
              this way. Being around other people doing something, even something small, changed
              things for me more than any amount of reading the news did. Somewhere in that, this
              project stopped being just a way to practice full-stack development and turned into
              something I wanted to exist: a way to hand someone else that same first push. You
              don&apos;t have to fix everything. Pick one issue, do one concrete thing about it, and
              let yourself off the hook for the rest, at least for now.
            </p>
            <p>
              What you&apos;re looking at right now is a working demonstration of the idea, not a
              live community yet. The events, actions and articles here aren&apos;t real. Articles
              and actions need real writing or curating and editorial judgment, both of which take
              time to get right. Events can be sourced but need ongoing upkeep to stay current —
              another time-consuming endeavor. And it&apos;s not just content: plenty of the
              day-to-day experience still needs work before this could hold up as something people
              actually rely on. I&apos;m holding off on all of that until I know the idea is worth
              it.
            </p>
            <p>
              So, I&apos;m using this demo to find out whether the idea is worth turning into the
              real thing. The people best positioned to answer that are the organizers and community
              leaders already doing this work locally, not me. If that&apos;s you, or you know who
              is, I&apos;d like to hear from you:{' '}
              <a href={feedbackMailto} className="inlineLink">
                email me
              </a>{' '}
              and tell me what you think.
            </p>
            <p className="storySignature">— Kevin Born</p>
          </>
        )}
      </section>

      {adminExposed ? (
        <section className="page-section about-journey stack-md">
          <h2>Admin workspace access</h2>
          <p>
            The admin workspace is where all of this gets managed: a moderation queue for reviewing
            community-submitted articles and events before they go live, and simple editors for
            writing and publishing articles, actions and events directly.
          </p>
          <p>
            These credentials are public and shared with every visitor, so log in and try things out
            — just know that whatever you publish, edit or moderate here is visible to everyone else
            exploring the demo too.
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
          <p>
            Ready to look around? Log in with the credentials above, dig through the code, or just
            say hi.
          </p>
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
              See the Code
            </Link>
            <a href={feedbackMailto} className="secondaryCTA">
              Get in Touch
            </a>
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
