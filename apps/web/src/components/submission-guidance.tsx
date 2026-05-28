export function SubmissionGuidance() {
  return (
    <div className="submissionGuidance">
      <details>
        <summary>What happens next?</summary>
        <div>
          <p>
            A moderator reviews each submission before anything is published. They may edit the
            title, summary, body, topics, links, or event details for clarity, accuracy, formatting,
            and fit with the site.
          </p>
          <p>
            Long-form article and event description fields support Markdown after publication. Plain
            text is fine. If you know Markdown, simple headings, links, and bullet lists are
            helpful. Do not submit HTML.
          </p>
        </div>
      </details>

      <details>
        <summary>Submission guidelines</summary>
        <div>
          <ul>
            <li>Choose topics that describe the issue, not every topic the resource touches.</li>
            <li>
              Submit original writing, public-domain material, or content you have permission to
              share.
            </li>
            <li>Do not paste full articles copied from another publication.</li>
            <li>
              Use supporting links for sources, organizer pages, or context a moderator can verify.
            </li>
            <li>
              A moderator may reject submissions that are unclear, unverifiable, duplicative, or
              outside the site scope.
            </li>
          </ul>
        </div>
      </details>
    </div>
  );
}
