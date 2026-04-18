# Phase 10.4 Plain React Forms And Validation Guide

This guide explains the React form concepts you need right now for Phase 10.4
without assuming prior frontend form experience.

Relevant canonical context:

- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/010-phase-10-4-submission-ui.md`

## Concepts To Understand Now

- what a plain React form is
- what "controlled inputs" means
- how a client component remembers what the user typed
- how inline validation works at submit time
- when a form library is helpful and when it is just extra abstraction

## Plain-Language Explanations

### What "start with plain form controls" means

It means:

- use normal HTML form elements
- use React state to remember their values
- use your own submit handler
- use your own error object for inline messages

In practice, that means elements such as:

- `<input type="text" />`
- `<textarea />`
- `<input type="email" />`
- `<input type="checkbox" />`
- `<button type="submit" />`

It does not mean:

- bring in `react-hook-form`
- bring in `formik`
- learn a field-registration API first
- hand control of the form to a library before you understand the basics

### What the browser would do by default

Without React state, a browser form still works as HTML:

- the user types into boxes
- the browser owns the current text
- the browser tries to submit the form

That is fine for simple HTML pages.

But your Phase 10.4 form also needs:

- inline errors
- a pending submit state
- success replacement
- preserving values after failed submit

That is why React state becomes useful.

### What a controlled input is

A controlled input is an input whose displayed value comes from React state.

Mental model:

- React remembers the current value
- the input displays that value
- when the user types, your code updates React state

So the source of truth is not "whatever is currently in the DOM." The source of
truth is the component state.

Why that matters here:

- you can validate the current values
- you can preserve them after a failed submit
- you can reset them after a success if needed
- you can show the user exactly what the form thinks the current values are

### What state you actually need

For a beginner, the easiest starting shape is:

1. one `formValues` state object
2. one `errors` state object
3. one `isSubmitting` boolean
4. one `submitError` string or `null`
5. one `isSuccess` boolean

That is enough for the first correct article form.

### What validation means in this form

Frontend validation here is for user experience.

It helps the user before the request goes to the API by checking obvious issues:

- required field is empty
- no topics selected
- email format looks invalid when provided

The backend is still the final authority.

Mental model:

- frontend validation improves UX
- backend validation protects the real contract

### Why submit-time validation is the right starting point

You could validate on every keystroke, on blur, or on submit.

For this phase, the simplest correct version is:

- validate when the user clicks submit

That keeps the logic easier to reason about:

1. user enters values
2. user clicks submit
3. your code checks the values
4. errors appear if needed
5. request only happens if the values pass your UI checks

### When a form library becomes worth it

A form library becomes worth it when your manual form code starts becoming hard
to understand or repetitive in a real way.

Examples:

- too many repetitive change handlers
- deeply nested field state
- very repetitive validation wiring
- many forms sharing the same abstractions

That is not where you are yet.

For Phase 10.4, plain React is the better learning path because it teaches the
actual mechanics first.

## Tiny Worked Examples

### Example 1: A normal text input

Conceptually:

```tsx
const [title, setTitle] = useState('');

<input value={title} onChange={(event) => setTitle(event.target.value)} />;
```

Meaning:

- `title` is the current remembered value
- the input displays `title`
- typing updates `title`

### Example 2: A checkbox list for topics

Conceptually:

```tsx
const [topicSlugs, setTopicSlugs] = useState<string[]>([]);
```

When a checkbox changes:

- if checked, add its slug to the array
- if unchecked, remove its slug from the array

Meaning:

- React remembers which topics are selected
- the UI reflects that array

### Example 3: A submit handler

Conceptually:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const nextErrors = validateFormValues(formValues);

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  // call API here
}
```

Meaning:

- stop the browser's default full-page submit
- validate the current values
- show errors if invalid
- only submit if validation passes

### Example 4: Inline error display

Conceptually:

```tsx
{
  errors.title ? <p className="submissionError">{errors.title}</p> : null;
}
```

Meaning:

- if there is a title error, render it under the title field
- if not, render nothing

## How This Appears In The Repo Today

Current repo shape already supports the right foundation:

- `apps/web/src/app/submit/article/page.tsx` fetches topics on the server
- `apps/web/src/components/article-submission.tsx` is the client form boundary
- `packages/api-contracts/submission_type.ts` defines the public request shape

That means your next job is not to invent architecture.

Your next job is to:

1. render the real fields
2. make them controlled
3. add an error object
4. add submit behavior

## Recommended First State Shape

For the article form, a beginner-friendly state shape is roughly:

```tsx
type ArticleFormValues = {
  title: string;
  summary: string;
  content: string;
  topicSlugs: string[];
  resourceLinksText: string;
  submitterName: string;
  submitterEmail: string;
};
```

And:

```tsx
type ArticleFormErrors = Partial<Record<keyof ArticleFormValues, string>>;
```

This is not the only possible shape.

It is just a simple one that keeps the first version understandable.

One useful simplification:

- keep supporting links as one textarea string at first
- split it into lines during submit handling

That is easier to learn than managing a dynamic array of input rows on the very
first pass.

## Common Mistakes

- adding a form library before understanding controlled inputs
- storing form values nowhere and trying to "read them from the page later"
- mixing route-level fetching and client form interaction into one component
- trying to mirror every backend validation rule immediately
- clearing user input after a failed submit
- handling article and event form complexity at the same time

## Tiny Rules Of Thumb

- if the user can type into it, decide where that value lives
- for this phase, let React state own the current field values
- validate on submit first; add fancier timing only if needed later
- frontend validation helps the user; backend validation still decides truth
- learn the plain version before adding a form library
