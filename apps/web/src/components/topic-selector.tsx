import { TopicListResponse } from '@signal-fire/api-contracts';
import Link from 'next/link';

type TopicSelectorProps = {
  topics: TopicListResponse;
  basePath: '/articles' | '/actions' | '/events';
  params: EntityParams;
};

type EntityParams =
  | {
      topicSlug?: string;
    }
  | {
      topicSlug?: string;
      startDate?: string;
      endDate?: string;
      city?: string;
      region?: string;
    };

function buildTopicHref(basePath: string, queryParams: EntityParams) {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function TopicSelector({ topics, basePath, params }: TopicSelectorProps) {
  const { topicSlug } = params;
  return (
    <nav className="topicSelector" aria-label="Filter by topic">
      <span className="topicSelectorLabel">Topic</span>
      <ul className="topicSelectorList">
        <li className="topicSelectorItem">
          <Link
            href={buildTopicHref(basePath, { ...params, topicSlug: undefined })}
            aria-current={!topicSlug ? 'page' : undefined}
          >
            All
          </Link>
        </li>
        {topics.items.map((topic) => (
          <li className="topicSelectorItem" key={topic.id}>
            <Link
              href={buildTopicHref(basePath, { ...params, topicSlug: topic.slug })}
              aria-current={topicSlug === topic.slug ? 'page' : undefined}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
