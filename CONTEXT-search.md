# Keyword Search Branch — Context for Next Agent

## What was built

A dedicated `/search` page that queries Articles and Actions simultaneously using
keyword search (ILIKE across title, summary, and content/description fields).

## Architecture

- `GET /articles?search=query` — new optional param, added to article request schema
- `GET /actions?search=query` — new optional param, added to action request schema
- `/search` page — Server Component reads `?q=` searchParam, fans out to both APIs
- `SearchInput` — Client Component handles form submit, pushes to URL state
- `search` param also wired into `/articles` and `/actions` collection pages so
  "See all X results" links work (e.g. `/articles?search=climate`)

## Decisions

**Events not included in search.** Events are time-and-location specific;
users discover them via date/city filters, not keyword search. Searching
events by keyword without a date context returns irrelevant past events.
Events remain accessible through their existing filtered browse surface.

**No dedicated search API endpoint.** Reused existing `/articles` and `/actions`
endpoints with an optional `search` param. This avoids a new endpoint while
keeping the API composable (topic + search can combine). The search page
defaults to pageSize=20 and links to the collection page for overflow results.

**Nav placement.** "Search" added as a text nav link between Events and About.
The header is now slightly dense (6 primary nav items). An icon-based search
affordance would be cleaner but requires adding an icon system to the header.
This can be revisited.

## What to review

- Search for "climate" on the live demo — should return articles and actions
- Test empty state: search for "zzz" — should show "No results for zzz"
- Test "See all X articles" link — should navigate to /articles?search=query
- Check that article and action pages still work without search param

## Files changed

**API:**

- `apps/api/src/article/article.request-schema.ts` — search param
- `apps/api/src/article/article.type.ts` — ValidatedArticleListQuery
- `apps/api/src/article/article.repository.ts` — OR filter in findPublished
- `apps/api/src/action/action.request-schema.ts` — search param
- `apps/api/src/action/action.type.ts` — ValidatedActionListQuery
- `apps/api/src/action/action.repository.ts` — OR filter in findPublished
- `packages/api-contracts/article.types.ts` — ArticleListRequest
- `packages/api-contracts/action.types.ts` — ActionListRequest

**Frontend:**

- `apps/web/src/lib/api/articles.ts` — search param passthrough
- `apps/web/src/lib/api/actions.ts` — search param passthrough
- `apps/web/src/app/(public)/articles/page.tsx` — search param passthrough
- `apps/web/src/app/(public)/actions/page.tsx` — search param passthrough
- `apps/web/src/app/(public)/search/page.tsx` — main search page
- `apps/web/src/app/(public)/search/_components/search-input.tsx` — client form
- `apps/web/src/app/(public)/search/loading.tsx` — skeleton
- `apps/web/src/app/(public)/layout.tsx` — Search added to nav + footer
- `apps/web/src/app/globals.css` — search page + form CSS
