# Browser Request vs Server Render API Call

In a Next App Router page, the browser may request HTML from the web app while
the API call happens separately inside the Next server process.

That means this browser request:

```text
GET http://localhost:3000/events
```

can cause this server-side API request:

```text
Next server -> GET http://localhost:3001/events
```

The browser only directly sees the first request unless browser-side code makes
the API request itself.

## Why The Network Tab Shows HTML

For a server page, the browser asks Next for a page.

Next then:

1. runs the route's `page.tsx` on the server
2. calls API helpers such as `getEventsList()`
3. waits for the API response
4. renders HTML / React Server Component payload
5. sends that rendered result back to the browser

So Chrome Network shows the response from `localhost:3000/events`, which is a
web page response. It is normal for that response to be HTML.

## Why You May Not See The API Call In Chrome

Chrome DevTools shows requests made by the browser.

A server component fetch is not made by the browser. It is made by the Next
server while building the page response.

Look for those API calls in:

- the API server logs
- the Next dev server logs
- a direct `curl` or browser request to the API port

## Client Components Are Different

If a client component calls `fetch()` after the page loads, that request is made
from the browser.

Those browser-side API calls do appear in Chrome Network and are subject to
browser rules like CORS.

This model is useful when the request is caused by user interaction after the
page has already loaded:

- submitting a form
- approving or rejecting a record
- loading more results
- live search
- refreshing dashboard data
- previewing optional content

It is less useful for initial public page content, because the first render
would usually become an empty shell, loading state, or extra client-side fetch.

## URL State Is A Third Option

Not every interactive page needs browser-side API fetching.

For admin submission filters, the filter values live in the URL:

```text
/admin/submissions?status=PENDING&type=ARTICLE
```

That means a filter change can navigate to a new URL, and the server page can
fetch the filtered records during the next render.

This keeps useful page state in the URL:

- refresh preserves the filtered view
- browser back and forward work naturally
- filtered views can be shared or bookmarked
- the page does not need duplicate client loading/error state just to list
  records

Browser-side fetching could work for the same feature, but then the client
would need to manage filter state, loading state, API errors, history behavior,
and URL synchronization if shareable links still matter.

## Mental Model

Server page:

```text
Browser -> Next web server -> API server -> database
Browser <- rendered page
```

Client fetch:

```text
Browser -> Next web page loads
Browser -> API server -> database
Browser <- API JSON
```

## Rule Of Thumb

- If data is needed to render the initial page, a server page can fetch it
  before the browser receives the page.
- If data changes because of browser interaction after the page loads, a client
  component usually owns that interaction.
- If the current view should survive refresh, support back/forward, or be
  shareable, consider URL params plus server fetching.
- Seeing HTML in Chrome Network usually means you are inspecting the web app
  document response, not the backend API response.
