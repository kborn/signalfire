import Link from 'next/link';

type TopicSummaryData = {
  slug: string;
  name: string;
  description: string;
};

export function TopicSummary({ topic }: { topic: TopicSummaryData }) {
  return (
    <div>
      <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      <p className="summary"> {topic.description}</p>
    </div>
  );
}
