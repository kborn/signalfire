import Link from 'next/link';

type PaginationParams = {
  topicSlug?: string;
  page?: string;
  pageSize?: string;
};

type PaginationProps = {
  basePath: '/articles' | '/actions' | '/events';
  page: number;
  totalPages: number;
  params: PaginationParams;
};

type PaginationToken =
  | {
      type: 'page';
      value: number;
    }
  | {
      type: 'ellipsis';
      value: string;
    };

function buildPaginationHref(basePath: string, queryParams: PaginationParams) {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getPaginationTokens(page: number, totalPages: number): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: 'page' as const,
      value: index + 1,
    }));
  }

  const pages = new Set<number>([1, totalPages, page - 2, page - 1, page, page + 1, page + 2]);
  const visiblePages = Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right);

  const tokens: PaginationToken[] = [];

  for (let index = 0; index < visiblePages.length; index += 1) {
    const current = visiblePages[index];
    const previous = visiblePages[index - 1];

    if (previous !== undefined && current - previous > 1) {
      tokens.push({
        type: 'ellipsis',
        value: `ellipsis-${previous}-${current}`,
      });
    }

    tokens.push({
      type: 'page',
      value: current,
    });
  }

  return tokens;
}

export function Pagination({ basePath, page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const tokens = getPaginationTokens(page, totalPages);

  return (
    <nav className="paginationNav" aria-label="Pagination">
      <ul className="paginationList">
        {page > 1 ? (
          <li className="paginationItem">
            <Link
              className="paginationLink"
              href={buildPaginationHref(basePath, { ...params, page: String(page - 1) })}
              rel="prev"
            >
              Previous
            </Link>
          </li>
        ) : null}
        {tokens.map((token) =>
          token.type === 'ellipsis' ? (
            <li className="paginationItem" key={token.value}>
              <span className="paginationEllipsis" aria-hidden="true">
                ...
              </span>
            </li>
          ) : (
            <li className="paginationItem" key={token.value}>
              <Link
                className="paginationLink"
                href={buildPaginationHref(basePath, { ...params, page: String(token.value) })}
                aria-current={token.value === page ? 'page' : undefined}
              >
                {token.value}
              </Link>
            </li>
          ),
        )}
        {page < totalPages ? (
          <li className="paginationItem">
            <Link
              className="paginationLink"
              href={buildPaginationHref(basePath, { ...params, page: String(page + 1) })}
              rel="next"
            >
              Next
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
