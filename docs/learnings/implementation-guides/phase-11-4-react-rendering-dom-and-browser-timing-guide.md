# Phase 11.4 React Rendering, DOM, And Browser Timing Guide

This guide explains the bigger frontend execution model behind the Phase 11.4
review-error scrolling bug. The important question is not just how to use
`useEffect`. It is how user events, JavaScript, React state, rendering, the DOM,
browser work, and tests fit together.

Relevant repo context:

- `apps/web/src/app/admin/submissions/[id]/SubmissionReviewPageContent.tsx`
- `apps/web/src/app/admin/submissions/[id]/SubmissionReviewPageContent.test.tsx`
- `docs/learnings/index-cards/61-dom-vs-react-state.md`
- `docs/learnings/index-cards/75-useeffect-after-render-dependencies.md`
- `docs/learnings/index-cards/77-settimeout-zero-after-render.md`

## Concepts To Understand Now

- what the browser DOM is
- what React state is and why it is not the DOM
- what "render" and "commit" mean in React
- what happens after a click handler calls `setState`
- what the JavaScript event loop does at a practical level
- why `setTimeout(..., 0)` is not a React render guarantee
- when `useEffect` is the correct place for DOM-dependent follow-up work
- why a UI timing race can appear as an intermittent test failure

## The Main Picture

A React page has several cooperating layers:

| Layer            | Responsibility in this feature                                    |
| ---------------- | ----------------------------------------------------------------- |
| Browser          | Displays HTML controls, receives clicks, performs scrolling       |
| DOM              | The browser's current tree of actual page elements                |
| JavaScript       | Runs click handlers, promise callbacks, and helper functions      |
| React state      | Stores values such as `errors`, `reviewNotes`, and `isSubmitting` |
| React render     | Decides what JSX should exist for the current state               |
| React commit     | Applies the rendered changes to the actual DOM                    |
| Effect           | Runs follow-up code after React has committed a render            |
| Test environment | Simulates the DOM and observes the same ordering requirements     |

When these layers are blurred together, code can look correct while depending
on timing that is not guaranteed.

## DOM: What Is Actually On The Page

The DOM, or Document Object Model, is the browser's in-memory tree of real page
elements.

Given JSX like:

```tsx
{
  errors.postalCode ? (
    <p id="normalized-postalCode-error" className="submissionError">
      {errors.postalCode}
    </p>
  ) : null;
}
```

the error `<p>` does not exist in the DOM when `errors.postalCode` is empty. It
only exists after React has processed state containing that error and committed
the new element.

This distinction matters for browser APIs:

```tsx
document.getElementById('normalized-postalCode-error')?.scrollIntoView();
```

That call can only scroll if the DOM element already exists. If it runs early,
`getElementById(...)` returns `null`; optional chaining prevents a crash, but no
scroll occurs.

## React State: What The Component Wants To Show

React state is data remembered by a rendered component:

```tsx
const [errors, setErrors] = useState<ReviewFormErrors>({});
```

`errors` is not a set of HTML elements. It is data that React uses to decide
which elements should appear on the next render.

The review page uses that state in two stages:

1. Business logic discovers errors:

```tsx
setErrors({
  postalCode: 'Postal code is required',
  contactEmail: 'Email must be valid',
});
```

2. JSX describes what should appear for that state:

```tsx
{
  errors.postalCode ? <p id="normalized-postalCode-error">...</p> : null;
}
```

Calling `setErrors(...)` requests the UI update. It does not mean the new
`<p>` can be queried from the DOM on the next source-code line.

## React Render And Commit

"Render" is often used loosely, but there are two useful steps to remember:

### 1. Render

React runs component logic using the latest props and state and determines the
desired JSX tree.

For the review page, React determines:

- whether the error banner should appear
- whether postal-code and email error text should appear
- which control attributes should change

### 2. Commit

React changes the browser DOM to match that calculated result.

Only after commit is there an actual error paragraph for browser code to find
and scroll to.

Practical rule:

- state describes the desired UI
- commit makes that UI real in the DOM

## The Timeline Of A Review Error

Consider the event approval API returning validation errors.

### Correct conceptual sequence

```text
User clicks Approve
  -> click handler runs
  -> API request rejects with validation errors
  -> code calls setErrors(fieldErrors)
  -> React renders error UI
  -> React commits error elements to the DOM
  -> effect runs
  -> effect finds the first rendered error element
  -> browser scrolls to it
```

The key dependency is:

```text
scroll requires the error element to already exist in the DOM
```

So scrolling belongs after commit, not merely after the code that requests the
state update.

## What Went Wrong With `setTimeout(..., 0)`

The original shape was:

```tsx
setErrors(fieldErrors);
setTimeout(() => scrollToFirstError(fieldErrors), 0);
```

This feels reasonable because the timeout defers scrolling. However, it only
means:

- do not run this callback during the current synchronous JavaScript call stack
- put it in a later turn of scheduled work

It does not mean:

- wait until React has committed these particular error elements

React also schedules and batches work. Most of the time, the element happened
to exist before the timeout callback ran. Under different test or machine
timing, the timeout callback queried the DOM before the event error element was
present:

```tsx
document.getElementById(id)?.scrollIntoView(...)
```

There was no exception because of `?.`, but there was also no scroll. That is
why the test saw inline error text eventually while observing zero calls to
`scrollIntoView`.

This is a race condition:

- outcome A: render commits first, scrolling works
- outcome B: scroll attempt runs first, nothing happens

The code should not depend on which one wins.

## The JavaScript Event Loop, Practically

You do not need a full browser-runtime course to reason about this feature.
Use this smaller mental model.

JavaScript handles one currently-running block of code at a time. Other work
gets scheduled for later, including:

- timer callbacks from `setTimeout`
- promise continuation code after `await`
- browser event handlers such as clicks
- framework work that reacts to changed state

Example:

```tsx
async function approve() {
  try {
    await postSubmissionReviewReq(request, id);
  } catch (error) {
    setErrors(fieldErrors);
    setTimeout(() => scrollToFirstError(fieldErrors), 0);
  }
}
```

The code before and after `await` does not run as one unbroken action:

1. the button click starts `approve`
2. the request begins
3. `approve` pauses at `await`
4. later, the failed response resumes the `catch` block
5. React receives a state update request
6. the timer callback is also scheduled

The mistake is assuming that step 6 is inherently ordered after React's DOM
commit. A timer is browser scheduling; an effect is React's after-commit
lifecycle.

## Why `useEffect` Fits The Requirement

The fixed pattern is:

```tsx
const [errors, setErrors] = useState<ReviewFormErrors>({});

useEffect(() => {
  if (Object.keys(errors).length > 0) {
    scrollToFirstError(errors);
  }
}, [errors]);
```

And error handling only changes state:

```tsx
setErrors(fieldErrors);
```

Read this as:

1. Set the error state because validation failed.
2. React renders and commits the error elements.
3. After the committed render, run code whose purpose is responding to the new
   error state.

This is not "use an effect whenever something happens." The effect is
appropriate because the action is:

- caused by a state change
- dependent on rendered DOM created from that state

Examples of similar DOM-dependent effects:

- focus the first invalid field after errors render
- measure a panel after it becomes visible
- announce dynamically inserted content to an integration that expects a node
- scroll a newly displayed result into view

## Event Handlers Versus Effects

Do not move all follow-up work into effects.

Use an event handler when the work is a direct consequence of the user action
and does not require new rendered DOM:

```tsx
async function approve() {
  setIsSubmitting(true);
  const result = await postSubmissionReviewReq(request, submission.id);
  setReviewResult(result);
}
```

Use an effect when the work must occur because rendered output now exists or
has changed:

```tsx
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    scrollToFirstError(errors);
  }
}, [errors]);
```

Useful distinction:

| Work                                                   | Best owner     |
| ------------------------------------------------------ | -------------- |
| Send POST request on button click                      | Event handler  |
| Update errors when request fails                       | Event handler  |
| Scroll to an error element created by rendering errors | Effect         |
| Construct approval request from current state          | Handler/helper |
| Display inline error paragraphs                        | JSX render     |

## Why This Was An Intermittent Test Failure

The test was valuable because it asserted user-visible behavior:

```tsx
expect(scrollIntoView).toHaveBeenCalledWith({
  behavior: 'smooth',
  block: 'center',
});
```

The inline errors rendered, so the validation path itself worked. The scroll
assertion occasionally failed because scrolling was attempted before its DOM
target existed.

That means the test was not merely "flaky" in the sense of being a bad test. It
was detecting non-deterministic implementation timing.

There are two different cases:

| Situation                                          | Response               |
| -------------------------------------------------- | ---------------------- |
| Test expects behavior the product does not promise | Fix or remove the test |
| Test expects promised behavior but code races      | Fix production code    |

Here the product intends to bring the reviewer to the first invalid field, so
the production code was the correct place to fix.

## How Testing Relates To The DOM

React Testing Library renders components into a simulated browser DOM provided
by JSDOM.

After:

```tsx
render(<SubmissionReviewPageContent submission={submission} topics={topics} />);
```

`screen` queries the current simulated document:

```tsx
screen.getByText('Postal code is required');
```

When state changes, React rerenders the mounted component, and queries see the
updated DOM. The test does not manually rebuild the page after the API mock
rejects.

JSDOM does not implement real scrolling layout behavior, so the test supplies a
mock function:

```tsx
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
});
```

That mock does not test pixel movement. It tests that application logic found a
rendered element and asked the browser to scroll it into view.

## A Debugging Method For State-To-DOM Bugs

When UI logic fails around focus, scrolling, measurement, animation, or
element selection, ask these questions in order:

1. **What state changed?**
   For this case: `errors` gained `postalCode` and `contactEmail`.

2. **What DOM element should appear because of that state?**
   For this case: `#normalized-postalCode-error`.

3. **Does the imperative browser action require that element to exist?**
   For this case: yes, `scrollIntoView()` requires an element.

4. **Where is the browser action called relative to React commit?**
   If it runs directly after `setState` or through a timer guess, it may race.

5. **Can the action be expressed as an effect of the committed state?**
   Here: yes, scrolling is an effect of rendered errors.

This method generalizes to:

- autofocus on a conditionally rendered field
- measuring modal dimensions after opening it
- selecting text in a newly mounted input
- scrolling to search results after they render

## Tiny Worked Examples

### Example 1: Incorrect immediate DOM lookup

```tsx
function showError() {
  setHasError(true);
  document.getElementById('error-message')?.scrollIntoView();
}
```

Problem:
`#error-message` may not exist until React commits the `hasError` render.

### Example 2: Incorrect timer-based guess

```tsx
function showError() {
  setHasError(true);
  setTimeout(() => {
    document.getElementById('error-message')?.scrollIntoView();
  }, 0);
}
```

Problem:
The timer runs later, but it is not tied to React having committed that node.

### Example 3: Correct state-driven follow-up

```tsx
function showError() {
  setHasError(true);
}

useEffect(() => {
  if (hasError) {
    document.getElementById('error-message')?.scrollIntoView();
  }
}, [hasError]);
```

Reason:
The scroll work runs after the render caused by `hasError`.

## How This Appears In The Repo Today

The review page has these responsibilities:

- the action handler sends approval or rejection requests
- failed validation updates `errors`
- JSX uses `errors` to render the banner and inline messages
- a `useEffect` observing `errors` scrolls to the first rendered message

The fixed boundary is:

```tsx
setErrors(fieldErrors);
```

followed independently by:

```tsx
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    scrollToFirstError(errors);
  }
}, [errors]);
```

The test verifies both pieces:

- API errors appear inline
- the page requests scrolling to the first rendered error

## What Can Wait Until Later

You do not need these topics to reason correctly about this bug:

- React concurrent rendering internals
- browser microtask versus macrotask specification detail
- layout and paint performance profiling
- `useLayoutEffect` optimization decisions
- custom focus-management abstractions

Those become useful only if a later feature needs visual measurement,
paint-before-effect control, or sophisticated accessibility focus handling.

## Tiny Rules Of Thumb

- State is data; the DOM is what the browser has actually rendered.
- `setState` requests a UI update; it does not immediately create elements.
- If code needs a newly rendered element, run it after React commit.
- `setTimeout(..., 0)` means later, not "after React finished rendering."
- Use event handlers for actions; use effects for rendered consequences of
  changed state.
- An intermittent test can be evidence of a real product race.

## Pointed Questions To Ask When Blocked

- Is my code reading or manipulating an element that React renders conditionally?
- Does this function need current state, or does it need committed DOM?
- Am I using a timer to guess that rendering finished?
- Would an effect express the actual dependency more accurately?
- Is a failing test exposing inconsistent UI behavior or only an incorrect assertion?
