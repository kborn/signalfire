import Link from 'next/link';

export default async function AboutPage() {
  return (
    <section className="page-section">
      <section className="page-section about-hero">
        <p className="section-label">Why this exists</p>
        <h1 className="pageTitle">You cannot fight everything.</h1>
        <p className="page-intro">
          Every day brings another headline, another crisis, another urgent demand for attention.
          Trying to carry all of it can leave us exhausted and unable to act.
        </p>
      </section>

      <section className="page-section about-body">
        <h2>The question is not whether you care.</h2>
        <p>
          People are angry, scared, and frustrated for good reason. It is easy to look at the scale
          of what is happening and ask who with enough power will step in and stop it.
        </p>
        <p>
          But power is not only something held somewhere else. It is also built when people choose
          where to focus, learn what is at stake, and take action together.
        </p>
        <p>
          Find Your Fight exists for the person saying: I want to do something, but I do not know
          what to do.
        </p>
      </section>

      <section className="page-section about-journey">
        <h2>Find one issue. Learn enough to act. Take the next step.</h2>

        <div className="about-steps">
          <section className="about-step">
            <p className="section-label">Step 1</p>
            <h3>Choose an issue.</h3>
            <p>
              Start with one area that you cannot stop thinking about. You do not need to solve
              everything. You need a place to focus.
            </p>
            <Link href="/topics" className="primaryCTA">
              Explore Issues
            </Link>
          </section>

          <section className="about-step">
            <p className="section-label">Step 2</p>
            <h3>Understand what is happening.</h3>
            <p>
              Read enough context to move from outrage or confusion into a clearer sense of what is
              at stake and where pressure can matter.
            </p>
            <Link href="/articles" className="secondaryCTA">
              Read Articles
            </Link>
          </section>

          <section className="about-step">
            <p className="section-label">Step 3</p>
            <h3>Take one concrete action.</h3>
            <p>
              You do not need to have the whole answer. Contact someone, volunteer, join an event,
              or support work already in motion. The first action does not have to be perfect. It
              has to be real.
            </p>
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
