import { ModerationSubmissionDetail } from '@signal-fire/api-contracts';

export default function SubmissionMetadataPanel({
  submission,
}: {
  submission: ModerationSubmissionDetail;
}) {
  return (
    <section className="adminPanel" aria-labelledby="submission-metadata-heading">
      <div className="adminPanelHeader">
        <h2 id="submission-metadata-heading">Submission metadata</h2>
      </div>
      <dl className="adminDefinitionList">
        <dt>Submission ID</dt>
        <dd>{submission.id}</dd>

        <dt>Submitter</dt>
        <dd>{submission.submitterName}</dd>

        <dt>Email</dt>
        <dd>{submission.submitterEmail}</dd>

        <dt>Reviewed</dt>
        <dd>
          {submission.reviewedAt
            ? new Date(submission.reviewedAt).toLocaleDateString()
            : 'Not reviewed'}
        </dd>
      </dl>
    </section>
  );
}
