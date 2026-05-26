import {
  EntityStatus,
  ModerationSubmissionDetail,
  SubmissionType,
} from '@signal-fire/api-contracts';
import Link from 'next/link';

export default function ReviewOutcomePanel({
  submission,
}: {
  submission: ModerationSubmissionDetail;
}) {
  function getHref(recordType: SubmissionType, publishStatus: EntityStatus) {
    if (publishStatus === 'PUBLISHED') {
      if (recordType === 'EVENT') {
        return `/events/${submission.createdRecord?.id}`;
      }
      return `/articles/${submission.createdRecord?.slug}`;
    }
    if (recordType === 'EVENT') {
      return `/admin/events/${submission.createdRecord?.id}`;
    }
    return `/admin/articles/${submission.createdRecord?.slug}`;
  }

  return (
    <section className="adminPanel" aria-labelledby="review-outcome-heading">
      <div className="adminPanelHeader">
        <h2 id="review-outcome-heading">Review outcome</h2>
      </div>

      <dl className="adminDefinitionList">
        <dt>Decision</dt>
        <dd>{submission.status === 'APPROVED' ? 'Approved' : 'Rejected'}</dd>

        <dt>Reviewed</dt>
        <dd>{submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : '--'}</dd>

        <dt>Review notes</dt>
        <dd>{submission.reviewNotes || '--'}</dd>
        {submission.status === 'APPROVED' && submission.createdRecord && (
          <>
            <dt>Created record</dt>

            <dd className="adminCreatedRecordValue">
              <Link
                className="adminCreatedRecordLink"
                href={getHref(
                  submission.createdRecord.recordType,
                  submission.createdRecord.publishStatus,
                )}
              >
                {submission.createdRecord.recordType === 'ARTICLE' ? 'View article' : 'View event'}
              </Link>

              <span className="adminBadge">{submission.createdRecord.publishStatus}</span>
            </dd>
          </>
        )}
      </dl>
    </section>
  );
}
