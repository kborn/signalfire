import { TopicListResponse } from '@signal-fire/api-contracts';
import Link from 'next/link';

function buildActionsHref(topicSlug?: string) {
  const params = new URLSearchParams();
  if (topicSlug) {
    params.set('topicSlug', topicSlug);
  }
  return `/actions?${params.toString()}`;
}
export function TopicSelector({ topics }: { topics: TopicListResponse }) {
  return (
    <div>
      {topics.items.map((topic) => (
        <div key={topic.id}>
          <Link href={buildActionsHref(topic.slug)}>{topic.name} </Link>
        </div>
      ))}
      <div>
        <Link href={buildActionsHref()}>{'All'} </Link>
      </div>
    </div>
  );
}
