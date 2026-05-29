import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Share a Resource</h1>
      <p className="page-intro">Submit an article or event for review.</p>
      <div className="submitOptionList">
        <Link href="/submit/article" className="collectionItem">
          <div>
            <p className="section-label">Article</p>
            <h2>Submit an Article</h2>
            <p>Share educational or explanatory content that helps others understand an issue</p>
          </div>
        </Link>
        <Link href="/submit/event" className="collectionItem">
          <div>
            <p className="section-label">Event</p>
            <h2>Submit an Event</h2>
            <p>Share an upcoming event, rally, meeting, workshop, or volunteer opportunity</p>
          </div>
        </Link>
      </div>
      <p className="metaText">All submissions are reviewed before publication.</p>
    </section>
  );
}
