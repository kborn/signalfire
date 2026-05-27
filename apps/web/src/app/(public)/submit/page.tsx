import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Submit Content</h1>
      <p className="page-intro">Share an article or event to help others learn and take action</p>
      <section>
        <h2>Submit an Article</h2>
        <p>Share educational or explanatory content that helps others understand an issue</p>
        <Link href="/submit/article" className="secondaryCTA">
          Submit an Article
        </Link>
      </section>
      <section>
        <h2>Submit an Event</h2>
        <p>Share an upcoming event, rally, meeting, workshop, or volunteer opportunity</p>
        <Link href="/submit/event" className="secondaryCTA">
          Submit an Event
        </Link>
      </section>
      <p>All submissions are reviewed before publication.</p>
    </section>
  );
}
