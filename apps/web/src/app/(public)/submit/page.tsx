import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Contribute to Find Your Fight</h1>
      <p className="page-intro">
        Submit an article or event for moderation. Nothing is published automatically.
      </p>
      <div className="submitOptionList">
        <Link href="/submit/article" className="collectionItem">
          <div>
            <p className="section-label">Article</p>
            <h2>Submit an Article or Guide</h2>
            <p>
              Share explainers, guides, and resource-backed writing that helps someone understand an
              issue and choose a next step.
            </p>
          </div>
        </Link>
        <Link href="/submit/event" className="collectionItem">
          <div>
            <p className="section-label">Event</p>
            <h2>Share an Event</h2>
            <p>Share an upcoming event, rally, meeting, workshop, or volunteer opportunity</p>
          </div>
        </Link>
      </div>
      <p className="metaText">Include enough context for moderation and publication preparation.</p>
    </section>
  );
}
