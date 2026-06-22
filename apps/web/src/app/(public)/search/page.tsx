import { connection } from 'next/server';
import { getArticlesList } from '@/lib/api/articles';
import { getActionsList } from '@/lib/api/actions';
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

  const [articles, actions] = await Promise.all([
    query ? getArticlesList({ search: query, pageSize: '20' }) : Promise.resolve(null),
    query ? getActionsList({ search: query, pageSize: '20' }) : Promise.resolve(null),
  ]);

  const totalResults = (articles?.totalItems ?? 0) + (actions?.totalItems ?? 0);

  return (
    <div className="page-section searchPage">
      <div className="searchHeader">
        <p className="section-label">Search</p>
        <h1 className="pageTitle">Search</h1>
        {!query && (
          <p className="page-intro">
            Search looks for word matches in article and action titles and content. If you
            don&apos;t find what you&apos;re looking for, try browsing by{' '}
            <Link href="/issues">issue</Link> — the categories cover more ground.
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
            <details className="searchResultSection">
              <summary className="searchResultSectionTitle">
                Articles
                <span className="searchResultCount">{articles!.totalItems}</span>
              </summary>
              <div className="searchResultContent">
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
              </div>
            </details>
          )}

          {(actions?.totalItems ?? 0) > 0 && (
            <details className="searchResultSection">
              <summary className="searchResultSectionTitle">
                Actions
                <span className="searchResultCount">{actions!.totalItems}</span>
              </summary>
              <div className="searchResultContent">
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
              </div>
            </details>
          )}

          {totalResults === 0 && (
            <div className="discoveryEmptyState">
              <p className="section-label">No results</p>
              <h2>Nothing found for &ldquo;{query}&rdquo;</h2>
              <p className="metaText">
                No match. This search works on word matches — try a simpler or broader term, or
                browse issues directly.
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
    </div>
  );
}
