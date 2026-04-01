import Link from 'next/link';

type ActionSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

export function ActionSummary({ action }: { action: ActionSummaryData }) {
  return (
    <article className="collectionItem">
      <h2 className="collectionItemTitle">
        <Link href={`/actions/${action.slug}`}>{action.title}</Link>
      </h2>
      <p className="collectionItemSummary">{action.summary}</p>
    </article>
  );
}
