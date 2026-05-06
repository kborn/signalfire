import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <section className="page-section">
      <Link href="/admin/submissions" className="adminTableLink">
        Back to submissions
      </Link>
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Submission review</h1>
          <p className="adminDek">
            Inspect submitted content before recording a moderation decision.
          </p>
        </div>

        <div className="adminToolbar" aria-label="Submission status summary">
          <span className="adminBadge">Type: Article</span>
          <span className="adminBadge">Status: Pending</span>
          <span className="adminBadge">Submitted: Not connected</span>
        </div>
      </header>

      <section className="adminPanel" aria-labelledby="submission-metadata-heading">
        <div className="adminPanelHeader">
          <h2 id="submission-metadata-heading">Submission metadata</h2>
        </div>
        <dl className="adminDefinitionList">
          <dt>Submission ID</dt>
          <dd>{id || 'Not loaded'}</dd>

          <dt>Submitter</dt>
          <dd>Anonymous</dd>

          <dt>Email</dt>
          <dd>Not provided</dd>

          <dt>Reviewed</dt>
          <dd>Not reviewed</dd>
        </dl>
      </section>

      <div className="adminReviewMain">
        <section className="adminPanel" aria-labelledby="submitted-content-heading">
          <div className="adminPanelHeader">
            <h2 id="submitted-content-heading">Submitted content</h2>
          </div>
          <dl className="adminDefinitionList">
            <dt>Title</dt>
            <dd>Dummy Title</dd>

            <dt>Summary</dt>
            <dd>Dummy Summary</dd>

            <dt>Topics</dt>
            <dd>Democracy, Climate</dd>
          </dl>
        </section>
        <section className="adminPanel" aria-labelledby="editorial-normalization-heading">
          <div className="adminPanelHeader">
            <h2 id="editorial-normalization-heading">Editorial normalization</h2>
          </div>
          <dl className="adminDefinitionList">
            <dt>Title</dt>
            <dd>Dummy Title</dd>

            <dt>Summary</dt>
            <dd>Dummy Summary</dd>

            <dt>Topics</dt>
            <dd>Democracy, Climate</dd>
          </dl>
        </section>
        <section className="adminPanel" aria-labelledby="review-notes-heading">
          <div className="adminPanelHeader">
            <h2 id="review-notes-heading">Review notes</h2>
          </div>
          <label htmlFor="review-notes">Internal notes</label>
          <textarea
            id="review-notes"
            className="submissionTextarea"
            disabled
            rows={5}
            aria-describedby="review-notes-helper"
          />
          <p id="review-notes-helper">
            Review notes are internal and will be saved with a moderation decision in a later Phase
            11 task.
          </p>
        </section>
        <section className="adminPanel" aria-labelledby="decision-actions-heading">
          <div className="adminPanelHeader">
            <h2 id="decision-actions-heading">Decision actions</h2>
          </div>
          <div className="adminFilterGroup" aria-label="Moderation actions">
            <button type="button" disabled>
              Approve and Publish
            </button>
            <button type="button" disabled>
              Approve as Draft
            </button>
            <button type="button" disabled>
              Reject
            </button>
          </div>
          <p>Moderation actions are not wired in Phase 11.1.</p>
        </section>
      </div>
    </section>
  );
}
