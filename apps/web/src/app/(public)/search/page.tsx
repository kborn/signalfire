import { connection } from 'next/server';
import { getArticlesList } from '@/lib/api/articles';
import { getActionsList } from '@/lib/api/actions';
import { getTopicsList } from '@/lib/api/topics';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import { SearchInput } from './_components/search-input';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  await connection();
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const [articles, actions, topicsData] = await Promise.all([
    query ? getArticlesList({ search: query, pageSize: '20' }) : Promise.resolve(null),
    query ? getActionsList({ search: query, pageSize: '20' }) : Promise.resolve(null),
    getTopicsList().catch(() => null),
  ]);
  const topics = topicsData?.items ?? [];

  const totalResults = (articles?.totalItems ?? 0) + (actions?.totalItems ?? 0);

  return (
    <div className="page-section searchPage">
      <div className="searchHeader">
        <p className="section-label">Search</p>
        <h1 className="pageTitle">Find articles and actions</h1>
        {!query && (
          <p className="page-intro">
            Search across explainers, field guides, and civic actions on the issues that matter to
            you.
          </p>
        )}
      </div>

      <SearchInput initialQuery={query} />

      {query && (
        <div className="searchResults">
          <p className="searchResultsMeta">
            {totalResults === 0
              ? `No results for "${query}"`
              : `${totalResults} result${totalResults === 1 ? '' : 's'} for "${query}"`}
          </p>

          {(articles?.totalItems ?? 0) > 0 && (
            <section className="searchResultSection">
              <h2 className="searchResultSectionTitle">
                Articles
                <span className="searchResultCount">{articles!.totalItems}</span>
              </h2>
              <div className="collectionList">
                {articles!.items.map((article) => (
                  <ArticleSummary key={article.id} article={article} />
                ))}
              </div>
              {articles!.totalItems > articles!.items.length && (
                <Link
                  href={`/articles?search=${encodeURIComponent(query)}`}
                  className="textCTA searchMoreLink"
                >
                  See all {articles!.totalItems} articles
                </Link>
              )}
            </section>
          )}

          {(actions?.totalItems ?? 0) > 0 && (
            <section className="searchResultSection">
              <h2 className="searchResultSectionTitle">
                Actions
                <span className="searchResultCount">{actions!.totalItems}</span>
              </h2>
              <div className="collectionList">
                {actions!.items.map((action) => (
                  <ActionSummary key={action.id} action={action} />
                ))}
              </div>
              {actions!.totalItems > actions!.items.length && (
                <Link
                  href={`/actions?search=${encodeURIComponent(query)}`}
                  className="textCTA searchMoreLink"
                >
                  See all {actions!.totalItems} actions
                </Link>
              )}
            </section>
          )}

          {totalResults === 0 && (
            <div className="discoveryEmptyState">
              <p className="section-label">No results</p>
              <h2>Nothing found for &ldquo;{query}&rdquo;</h2>
              <p className="metaText">
                Try a shorter search, a different keyword, or browse by issue to find related
                content.
              </p>
              <div className="ctaRow">
                <Link href="/issues" className="secondaryCTA">
                  Browse Issues
                </Link>
                <Link href="/articles" className="secondaryCTA">
                  All Articles
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {topics.length > 0 && (
        <>
          <div className="searchOrDivider" aria-hidden="true">
            <span>or</span>
          </div>
          <section className="searchBrowseSection">
            <p className="section-label">Browse by issue</p>
            <ul className="searchBrowseTopics" aria-label="Browse issues">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <Link href={`/issues/${topic.slug}`}>{topic.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
