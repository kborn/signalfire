# Form Element Vs Loose Submit Button

If the UI is a real user-input form, prefer a semantic HTML `<form>` with a
submit button over a loose button that manually simulates submission.

Why it matters here:

Phase 10.4 submission pages are real forms with fields, validation, and submit
behavior. Using a `<form>` gives one clear place for submit handling and keeps
the markup aligned with the UI's actual job.

Tiny example:

- preferred: `<form onSubmit={handleSubmit}> ... <button type="submit">Submit</button></form>`
- weaker: `<section> ... <button onClick={submit}>Submit</button></section>`

Rule of thumb:

- if the button's main job is to submit the current field values, it probably
  belongs inside a `<form>` as `type="submit"`
