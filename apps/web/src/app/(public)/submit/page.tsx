import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section submitEntryPage motifPage centeredPublicPage">
      <h1 className="pageTitle">Contribute to Find Your Fight</h1>
      <p className="page-intro">
        Help other people get involved. Share what belongs here, and we will review it before it
        goes live.
      </p>
      <div className="submitOptionList">
        <Link href="/submit/article" className="collectionItem submitOptionCard">
          <div>
            <p className="section-label">Article</p>
            <h2>Submit an Article or Guide</h2>
            <p>
              Share explainers, guides, and resource-backed writing that helps someone understand an
              issue and choose a next step.
            </p>
          </div>
        </Link>
        <Link href="/submit/event" className="collectionItem submitOptionCard">
          <div>
            <p className="section-label">Event</p>
            <h2>Share an Event</h2>
            <p>Share an upcoming event, rally, meeting, workshop, or volunteer opportunity.</p>
          </div>
        </Link>
      </div>
      <div className="submitEntrySupport">
        <div className="submitEntrySupportCard">
          <p className="section-label">Reviewed by a person</p>
          <p className="metaText">
            Every submission is checked for clarity, fit, and basic verification before it appears
            on the site.
          </p>
        </div>
        <div className="submitEntrySupportCard">
          <p className="section-label">What helps most</p>
          <p className="metaText">
            Strong summaries, accurate links, and enough context for someone else to trust what they
            are reading.
          </p>
        </div>
        <Link href="/about" className="textCTA">
          Read more about the project
        </Link>
      </div>
    </section>
  );
}
