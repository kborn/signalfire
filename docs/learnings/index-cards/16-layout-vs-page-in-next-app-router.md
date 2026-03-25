# Layout vs Page in Next App Router

`layout.tsx` defines shared UI around routes, while `page.tsx` defines the UI
for one route.

Why it matters here:
Phase 6.1 needs one public browsing shell with shared navigation, not repeated
headers on every route.

Rule of thumb:
If it should appear on Home, Topics, Articles, and Actions, it probably belongs
in a layout. If it belongs only to one route, it belongs in that route's page.
