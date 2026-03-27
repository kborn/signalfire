import Link from 'next/link';

type ActionSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

export function ActionSummary({ action }: { action: ActionSummaryData }) {
  return (
    <article>
      <h3>
        <Link href={`/actions/${action.slug}`}>{action.title}</Link>
      </h3>
      <p className="summary">{action.summary}</p>
    </article>
  );
}
