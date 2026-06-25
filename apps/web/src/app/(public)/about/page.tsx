import Link from 'next/link';

export default async function AboutPage() {
  return (
    <section className="page-section aboutPage motifPage centeredPublicPage">
      <section className="page-section about-hero">
        <p className="section-label">About Find Your Fight</p>
        <h1 className="pageTitle">Find your issue. Find your way in.</h1>
        <p className="page-intro">
          Find Your Fight is for people who care, want to do something real, and feel stuck about
          where to start.
        </p>
        <p className="aboutHeroSupport">
          The name means two things: find the issue that already has your attention, and find the
          determination within yourself to actually do something about it. This site is here to help
          with both.
        </p>
      </section>

      <section className="page-section about-body">
        <h2>You&apos;re not stuck because you don&apos;t care.</h2>
        <p>
          People are angry, overwhelmed, and frustrated for good reason. Elections are being
          contested. The climate is changing faster than policy is. Wealth is concentrating in ways
          that ripple into housing, healthcare, and education. It&#39;s easy to look at all of that
          and feel like nothing you do will matter.
        </p>
        <p>
          What makes it worse is that the longer you stay out of it, the bigger it feels. The bigger
          it feels, the easier it is to keep waiting. Most hard things work this way. At some point
          you just have to step in — and the strange part is that it&#39;s almost never as hard as
          you had imagined. That first step is the hardest part.
        </p>
        <p>
          Find Your Fight exists for the person saying: I want to do something, but I do not know
          where to start. That is who this is for.
        </p>
        <p>
          And &ldquo;doing something&rdquo; is a wider category than it sounds. Talking to a
          neighbor about what you learned. Keeping up with one issue so you are not caught off
          guard. Writing one email this week. None of this is nothing. The feeling that nothing you
          do matters — that is not an objective fact. That is the feeling winning. Don&apos;t let
          it.
        </p>
      </section>

      <section className="page-section about-community">
        <p className="section-label">Contribute</p>
        <h2>Have something worth sharing?</h2>
        <p>
          Articles, events, and resources can be submitted by anyone. Every submission goes through
          an editorial review before it goes live.
        </p>
        <p>That review keeps what&apos;s here worth acting on.</p>
        <Link href="/submit" className="primaryCTA">
          Send a Submission
        </Link>
      </section>

      <section className="page-section about-journey">
        <h2>Find one issue. Learn enough to act. Take the next step.</h2>

        <div className="about-steps stack-md">
          <Link href="/issues" className="about-step collectionItem">
            <div className="aboutStepNum">01</div>
            <h3>Choose an issue.</h3>
            <p>
              Start with the one that already has your attention. You do not need to carry all of
              them. You just need a place to focus.
            </p>
          </Link>

          <Link href="/articles" className="about-step collectionItem">
            <div className="aboutStepNum">02</div>
            <h3>Understand what is happening.</h3>
            <p>
              Read enough to move from outrage or confusion into a clearer sense of what is at stake
              and where pressure can actually make a difference.
            </p>
          </Link>

          <section className="about-step collectionItem">
            <Link href="/actions" className="about-step-mainLink">
              <div className="aboutStepNum">03</div>
              <h3>Take one concrete action.</h3>
              <p>
                You do not need the whole answer. Contact someone, volunteer, join an event, or
                support work already in motion. The first action does not have to be perfect. It
                just has to be real.
              </p>
            </Link>
            <div className="ctaRow">
              <Link href="/actions" className="secondaryCTA">
                Find Actions
              </Link>
              <Link href="/events" className="secondaryCTA">
                Find Events
              </Link>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}
