import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Contribute to Find Your Fight</h1>
      <p className="page-intro">
        Community submissions help expand this site. Submit an article, resource, or event for
        moderation review.
      </p>
      <div className="submitOptionList">
        <Link href="/submit/article" className="collectionItem">
          <div>
            <p className="section-label">Article</p>
            <h2>Submit an Article or Resource</h2>
            <p>
              Submit educational explainers that help people understand an issue, with guides and
              resources as supporting context for action
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
      <p className="metaText">Every submission is reviewed before publication.</p>
    </section>
  );
}
