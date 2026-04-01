import Link from 'next/link';

type TopicSummaryData = {
  slug: string;
  name: string;
  description: string;
};

export function TopicSummary({ topic }: { topic: TopicSummaryData }) {
  return (
    <article className="collectionItem">
      <h2 className="collectionItemTitle">
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </h2>
      <p className="collectionItemSummary">{topic.description}</p>
    </article>
  );
}
