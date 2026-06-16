# Phase 12 Event Filters Debounce React Flow Guide

This guide explains the public Events city-filter debounce at a very low level.
The goal is not only to understand the feature. It is to understand a compact
React execution loop involving:

- component mount
- `useState`
- `useEffect`
- effect cleanup
- timer scheduling
- state-triggered re-render
- URL-driven page state

Relevant repo context:

- `apps/web/src/app/(public)/events/_components/event-filters.tsx`
- `apps/web/src/components/debounce.tsx`
- `docs/learnings/index-cards/75-useeffect-after-render-dependencies.md`
- `docs/learnings/index-cards/107-useeffect-cleanup-and-reruns.md`
- `docs/learnings/index-cards/108-useeffect-return-value.md`
- `docs/learnings/index-cards/109-component-mount-vs-rerender.md`
- `docs/learnings/index-cards/110-setstate-triggers-rerender.md`

## The Feature In One Sentence

The Events page keeps committed filter state in the URL, but lets the city text
box hold a short-lived local draft value while the user is typing. After the
user pauses, the draft value is debounced and committed back into the URL.

## The Two Values That Matter

Inside `EventFilters`, the city filter has two distinct values:

1. `city`
   The immediate local draft value used to render the input
2. `debouncedCity`
   A delayed copy of `city` used to decide when to route

That split is the whole feature.

## What `useDebounce` Actually Returns

The hook looks like this:

```tsx
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

Important clarification:

- `useDebounce(...)` is called on every render
- it returns `debouncedValue` immediately on that render
- `debouncedValue` is not reinitialized on every call
- it is initialized only on mount for that hook instance

That means:

- first render: `debouncedValue` starts equal to `value`
- later renders: `debouncedValue` may lag behind `value`

If `useDebounce` simply returned `value` every render, debounce would not
exist.

## What "Mount" Means Here

`EventFilters` mounts when React creates that component instance and inserts it
into the active UI tree.

Examples:

- loading `/events` fresh
- navigating to `/events` from another page
- returning to `/events` after leaving it

Mount is not the same as re-render.

Typing into the city input does not mount a new `EventFilters`. It re-renders
the same mounted instance.

This matters because:

```tsx
const [debouncedValue, setDebouncedValue] = useState(value);
```

uses `value` only for initial state on mount. Later renders reuse the stored
state value.

## First Page Load: No Query Params

Start at `/events`.

The page normalizes default date inputs and passes props into `EventFilters`.
At this point:

- `params.city` is `undefined`
- `params.startDate` is a normalized date string
- `params.endDate` is a normalized date string

Then `EventFilters` renders:

```tsx
const [city, setCity] = useState(params.city ?? '');
const debouncedCity = useDebounce(city, 700);
```

On this first render:

- `city` initializes to `''`
- `debouncedValue` inside `useDebounce` also initializes to `''`
- so `debouncedCity === ''` immediately

After render commits:

1. the effect inside `useDebounce` starts a timer
2. the effect inside `EventFilters` runs

That second effect is:

```tsx
useEffect(() => {
  const normalizedCity = debouncedCity.trim();
  const normalizedParamCity = (params.city ?? '').trim();

  if (normalizedCity === normalizedParamCity) {
    return;
  }

  commitFilters({ city: normalizedCity || undefined });
}, [debouncedCity, params.city, commitFilters]);
```

On first load:

- `normalizedCity === ''`
- `normalizedParamCity === ''`
- they match
- no route happens

The debounce timer may still fire later, but it would call:

```tsx
setDebouncedValue('');
```

which does not meaningfully change state.

## Typing One Character

Assume the user types `P`.

### Step 1: the event handler runs

```tsx
onChange={(event) => setCity(event.target.value)}
```

So:

- `setCity('P')` runs

### Step 2: React schedules a re-render

`setCity(...)` does not manually push data upward. It schedules another render.

On the new render:

- `city === 'P'`
- `useDebounce('P', 700)` is called again
- but `debouncedValue` is still the previously stored `''`

So at this point:

- immediate input value is `'P'`
- debounced value is still `''`

This lag is the debounce behavior.

### Step 3: the debounce hook effect reruns

Because `[value, delay]` changed, React:

1. runs cleanup from the previous debounce effect
2. starts a new timer for `'P'`

No route happens yet, because `debouncedCity` still has the old settled value.

## Typing Again Before 700ms

Suppose the user types `Ph` before the timer for `P` finishes.

React renders again with:

- `city === 'Ph'`
- `debouncedCity` still `''`

Then React handles the debounce effect lifecycle:

1. cleanup from the previous debounce effect runs
2. that cleanup calls `clearTimeout(oldTimer)`
3. a new timer is started for `'Ph'`

This is why the debounce works.

The old timer never gets to publish `'P'`.

## When The Timer Finally Fires

Now assume the user stops typing and the newest timer survives the full delay.

The callback inside the hook runs:

```tsx
setDebouncedValue(value);
```

This is crucial:

- `setDebouncedValue(...)` updates hook state
- updating hook state triggers another render
- the caller sees the new return value on that next render

There is no manual "send value back up" step.

The flow is:

```text
timer fires
-> setDebouncedValue(...)
-> React schedules a render
-> EventFilters renders again
-> useDebounce(...) now returns the updated debounced value
```

## Why The Route Happens In `useEffect`

The page-routing logic is intentionally inside an effect:

```tsx
useEffect(() => {
  ...
  commitFilters(...);
}, [debouncedCity, params.city, commitFilters]);
```

Why not place it directly in the component body?

Because component render should stay pure.

Good render-time logic:

- derive `dateRangeError`
- normalize strings
- return JSX

Not render-time logic:

- `router.replace(...)`
- timers
- DOM listeners
- localStorage/sessionStorage writes

Routing is a side effect. `useEffect` is the place for side effects that should
happen after render.

## What `commitFilters` Does

`commitFilters` builds the next URL-driven state:

```tsx
const queryParams = {
  ...params,
  ...nextValues,
  page: undefined,
};
```

Meaning:

- preserve existing committed filter state
- override the changed field
- reset `page` when the filter changes

Then it validates date ordering and routes:

```tsx
route(router, queryParams);
```

That means the URL remains the committed source of truth, even though `city`
used local draft state while typing.

## What Happens After `router.replace(...)`

After `commitFilters` routes:

1. the URL changes
2. the page is re-evaluated with new search params
3. `EventFilters` receives new `params`
4. the effect compares:
   - local debounced city
   - committed URL city

If they match, it does nothing further.

That comparison prevents redundant reroutes.

## The Mental Model To Keep

For this feature:

- `city` is draft state
- `debouncedCity` is delayed draft state
- `params.city` is committed URL state

And the execution loop is:

```text
type
-> setCity(...)
-> re-render
-> debounce timer resets
-> user pauses
-> timer fires
-> setDebouncedValue(...)
-> re-render
-> effect sees debounced value differs from URL value
-> route
-> page rerenders with new params
-> effect sees they now match
-> stop
```

That loop is the feature.
