import React from 'react';
import Link from 'next/link';
import type { TopicSummary as TopicSummaryData } from '@signal-fire/api-contracts';
import {
  DemocracyIcon,
  ClimateIcon,
  CivilRightsIcon,
  ConsumerActivismIcon,
  EconomicJusticeIcon,
  EducationIcon,
  LocalCommunityIcon,
  GenericIssueIcon,
} from '@/components/icons';
import type { SVGProps } from 'react';

type TopicSummaryVariant = 'collection' | 'related';

type TopicSummaryProps = {
  topic: TopicSummaryData;
  variant?: TopicSummaryVariant;
};

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

const TOPIC_ICON_MAP: Record<string, IconComponent> = {
  democracy: DemocracyIcon,
  climate: ClimateIcon,
  'civil-rights': CivilRightsIcon,
  'consumer-activism': ConsumerActivismIcon,
  'economic-justice': EconomicJusticeIcon,
  education: EducationIcon,
  'local-community': LocalCommunityIcon,
};

export function TopicSummary({ topic, variant = 'collection' }: TopicSummaryProps) {
  const itemClassName =
    variant === 'related'
      ? 'relatedListItem'
      : 'collectionItem topicCollectionItem topicCollectionItemTilt';
  const titleClassName = variant === 'related' ? 'relatedListItemTitle' : 'collectionItemTitle';
  const summaryClassName =
    variant === 'related' ? 'relatedListItemSummary' : 'collectionItemSummary';
  const TitleTag = variant === 'related' ? 'h4' : 'h2';
  const Icon =
    variant === 'collection' ? (TOPIC_ICON_MAP[topic.slug] ?? GenericIssueIcon) : undefined;

  return (
    <Link
      href={`/issues/${topic.slug}`}
      className={itemClassName}
      data-topic={topic.slug}
      style={topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined}
    >
      {Icon ? (
        <span className="topicCardIcon">
          <Icon width={30} height={30} />
        </span>
      ) : null}
      <TitleTag className={titleClassName}>{topic.name}</TitleTag>
      <p className={summaryClassName}>{topic.description}</p>
    </Link>
  );
}
