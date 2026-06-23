import Link from 'next/link';

export default function ChooseSubmitTypePage() {
  return (
    <section className="page-section submitEntryPage motifPage centeredPublicPage">
      <div className="submitEntryHeader">
        <p className="section-label">Contribute</p>
        <h1 className="pageTitle">Share what you know.</h1>
        <p className="page-intro">
          If you know of something we missed — an article, a guide, an event — send it in.
          Everything gets reviewed before it goes live.
        </p>
      </div>
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
            <p>
              Know about a rally, town hall, workshop, or volunteer shift someone should be at? Put
              it here.
            </p>
          </div>
        </Link>
      </div>
      <div className="submitEntrySupport">
        <div className="submitEntrySupportCard">
          <p className="section-label">Reviewed by a person</p>
          <p className="metaText">
            A real person reviews every submission before it appears on the site.
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
