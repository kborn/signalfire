import { TopicListResponse } from '@signal-fire/api-contracts';
import Link from 'next/link';

function buildTopicHref(basePath: string, topicSlug?: string) {
  const params = new URLSearchParams();
  if (topicSlug) {
    params.set('topicSlug', topicSlug);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

type TopicSelectorProps = {
  topics: TopicListResponse;
  basePath: '/articles' | '/actions';
  currentTopicSlug?: string;
};

export function TopicSelector({ topics, basePath, currentTopicSlug }: TopicSelectorProps) {
  return (
    <nav className="topicSelector" aria-label="Filter by topic">
      <span className="topicSelectorLabel">Topic</span>
      <ul className="topicSelectorList">
        <li className="topicSelectorItem">
          <Link
            href={buildTopicHref(basePath)}
            aria-current={!currentTopicSlug ? 'page' : undefined}
          >
            All
          </Link>
        </li>
        {topics.items.map((topic) => (
          <li className="topicSelectorItem" key={topic.id}>
            <Link
              href={buildTopicHref(basePath, topic.slug)}
              aria-current={currentTopicSlug === topic.slug ? 'page' : undefined}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
