import Link from 'next/link';
import { getSubmissionsDetails } from '@/lib/api/admin';
import { ModerationSubmissionDetail } from '@signal-fire/api-contracts';

export const dynamic = 'force-dynamic';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

function SubmittedContentPanel({ submission }: { submission: ModerationSubmissionDetail }) {
  return submission.submissionType === 'ARTICLE' ? (
    <ArticleSubmittedContent submission={submission} />
  ) : (
    <EventSubmittedContent submission={submission} />
  );
}

function EditorialNormalizationPanel({ submission }: { submission: ModerationSubmissionDetail }) {
  return submission.submissionType === 'ARTICLE' ? (
    <ArticleNormalizationForm submission={submission} />
  ) : (
    <EventNormalizationForm submission={submission} />
  );
}

function ArticleSubmittedContent({ submission }: { submission: ArticleModerationSubmission }) {
  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Content</dt>
      <dd>{submission.submittedContent.content}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
      <dt>Resource Links</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.resourceLinks.map((link) => (
            <li key={link}>
              <a href={link}>{link}</a>
            </li>
          ))}
        </ul>
      </dd>
      <dt>Author</dt>
      <dd>{submission.submittedContent.author ?? '--'}</dd>
    </dl>
  );
}

function EventSubmittedContent({ submission }: { submission: EventModerationSubmission }) {
  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Description</dt>
      <dd>{submission.submittedContent.description}</dd>
      <dt>Event Type</dt>
      <dd>{submission.submittedContent.eventType}</dd>
      <dt>Event Start</dt>
      <dd>{submission.submittedContent.startTime}</dd>
      <dt>Event End</dt>
      <dd>{submission.submittedContent.endTime ?? '--'}</dd>
      <dt>Location Name</dt>
      <dd>{submission.submittedContent.locationName}</dd>
      <dt>Address</dt>
      <dd>{submission.submittedContent.addressRaw ?? '--'}</dd>
      <dt>City</dt>
      <dd>{submission.submittedContent.city}</dd>
      <dt>State</dt>
      <dd>{submission.submittedContent.region}</dd>
      <dt>Country</dt>
      <dd>{submission.submittedContent.country}</dd>
      <dt>Zip</dt>
      <dd>{submission.submittedContent.postalCode ?? '--'}</dd>
      <dt>Event Website</dt>
      <dd>{submission.submittedContent.website ?? '--'}</dd>
      <dt>Event Contact</dt>
      <dd>{submission.submittedContent.contactEmail ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}

function ArticleNormalizationForm({ submission }: { submission: ArticleModerationSubmission }) {
  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Content</dt>
      <dd>{submission.submittedContent.content}</dd>
      <dt>Author</dt>
      <dd>{submission.submittedContent.author ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
      <dt>Publish Status</dt>
      <dd>Check boxes or a button or something here</dd>
    </dl>
  );
}

function EventNormalizationForm({ submission }: { submission: EventModerationSubmission }) {
  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Description</dt>
      <dd>{submission.submittedContent.description}</dd>
      <dt>Event Type</dt>
      <dd>{submission.submittedContent.eventType}</dd>
      <dt>Event Start</dt>
      <dd>{submission.submittedContent.startTime}</dd>
      <dt>Event End</dt>
      <dd>{submission.submittedContent.endTime ?? '--'}</dd>
      <dt>Location Name</dt>
      <dd>{submission.submittedContent.locationName}</dd>
      <dt>Address</dt>
      <dd>{submission.submittedContent.addressRaw ?? '--'}</dd>
      <dt>City</dt>
      <dd>{submission.submittedContent.city}</dd>
      <dt>State</dt>
      <dd>{submission.submittedContent.region}</dd>
      <dt>Country</dt>
      <dd>{submission.submittedContent.country}</dd>
      <dt>Zip</dt>
      <dd>{submission.submittedContent.postalCode ?? '--'}</dd>
      <dt>Event Website</dt>
      <dd>{submission.submittedContent.website ?? '--'}</dd>
      <dt>Event Contact</dt>
      <dd>{submission.submittedContent.contactEmail ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
      <dt>Publish Status</dt>
      <dd>Check boxes or a button or something here</dd>
    </dl>
  );
}

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmissionsDetails(Number(id));

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
          <span className="adminBadge">Type: {submission.submissionType}</span>
          <span className="adminBadge">Status: {submission.status}</span>
          <span className="adminBadge">
            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
          </span>
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
          <dd>{submission.submitterName}</dd>

          <dt>Email</dt>
          <dd>{submission.submitterEmail}</dd>

          <dt>Reviewed</dt>
          <dd>Not reviewed</dd>
        </dl>
      </section>

      <div className="adminReviewMain">
        <section className="adminPanel" aria-labelledby="submitted-content-heading">
          <div className="adminPanelHeader">
            <h2 id="submitted-content-heading">Submitted content</h2>
          </div>
          <SubmittedContentPanel submission={submission} />
        </section>
        <section className="adminPanel" aria-labelledby="editorial-normalization-heading">
          <div className="adminPanelHeader">
            <h2 id="editorial-normalization-heading">Editorial normalization</h2>
          </div>
          <EditorialNormalizationPanel submission={submission} />
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
