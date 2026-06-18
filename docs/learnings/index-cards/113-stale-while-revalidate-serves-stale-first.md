# 113) Stale-While-Revalidate Serves Stale First

## The rule

With stale-while-revalidate caching, the first request after expiry can still
receive stale content while triggering a background refresh.

## What that means

The sequence is:

1. cached page exists
2. cache window expires
3. next request gets stale content immediately
4. background regeneration fetches fresh data
5. later request gets fresh content

## Why this exists

This keeps the boundary request fast instead of making the user wait for
regeneration.

The tradeoff is freshness:

- faster response for the first request after expiry
- fresh content usually arrives on the following request

## Why it mattered here

This repo uses public-page caching with fallback TTL revalidation.

That behavior was acceptable as a general cache strategy, but it felt wrong for
admin edits because the first public refresh after the TTL boundary could still
show stale content.

That is why admin-triggered invalidation was added on top of the TTL fallback.
