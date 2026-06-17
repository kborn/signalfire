import Link from 'next/link';

const PAGE_SIZE_OPTIONS = ['5', '10', '20'] as const;

type PageSizeParams = {
  topicSlug?: string;
  page?: string;
  pageSize?: string;
};

type PageSizeSelectorProps = {
  basePath: '/articles' | '/actions' | '/events';
  params: PageSizeParams;
};

function buildPageSizeHref(basePath: string, queryParams: PageSizeParams) {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function PageSizeSelector({ basePath, params }: PageSizeSelectorProps) {
  const currentPageSize = params.pageSize ?? '10';

  return (
    <nav className="pageSizeSelector" aria-label="Results per page">
      <span className="pageSizeSelectorLabel">Results per page</span>
      <ul className="pageSizeSelectorList">
        {PAGE_SIZE_OPTIONS.map((pageSize) => (
          <li className="pageSizeSelectorItem" key={pageSize}>
            <Link
              className="pageSizeSelectorLink"
              href={buildPageSizeHref(basePath, {
                ...params,
                page: undefined,
                pageSize,
              })}
              aria-current={currentPageSize === pageSize ? 'page' : undefined}
            >
              {pageSize}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
