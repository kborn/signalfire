import Link from 'next/link';

type TopicSummaryData = {
  slug: string;
  name: string;
  description: string;
};

export function TopicSummary({ topic }: { topic: TopicSummaryData }) {
  return (
    <article>
      <h3>
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </h3>
      <p className="summary">{topic.description}</p>
    </article>
  );
}
