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
    <nav className="topicSelector" aria-label="Filter by topic">
      <span className="topicSelectorLabel">Topic</span>
      <ul className="topicSelectorList">
        <li className="topicSelectorItem">
          <Link href={buildActionsHref()}>{'All'} </Link>
        </li>
        {topics.items.map((topic) => (
          <li className="topicSelectorItem" key={topic.id}>
            <Link href={buildActionsHref(topic.slug)}>{topic.name} </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
