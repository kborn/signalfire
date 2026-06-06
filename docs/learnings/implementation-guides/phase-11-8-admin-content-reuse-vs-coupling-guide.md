# Phase 11.8 Admin Articles Reuse Vs Coupling Guide

## Concepts To Understand Now

- reuse the stable parts of the form system, not the whole feature
- validation helpers are safer to share than domain-shaped editor components
- backend request schemas and frontend UX validation solve different problems
- the Actions editor is the comparison baseline, not the abstraction target
- a shared abstraction should reduce duplication without hiding domain differences

## Plain-Language Explanations

### What should be shared

In the next `admin/articles` PR, the cleanest reuse boundary is the smallest
piece that is still truly general.

Good candidates for sharing in the articles PR:

- required-string validation helpers
- optional max-length helpers
- API validation error mapping helpers
- shared submission/save-state UI behavior
- shared contract types that describe real API boundaries
- shared Zod-to-HTTP error conversion logic

These pieces are stable because they do not care whether the editor is for an
Action or an Article.

### What should stay separate

Keep the domain-specific pieces separate when the field set or lifecycle differs.

Examples for the articles PR:

- admin request schema for Action vs Article
- validation pipe per route/domain
- form state types for one editor page
- error-field ordering for one editor page
- route-specific page structure and helper text
- payload mapping for one content type

These pieces look repetitive, but they are different because each editor answers
a different product question.

### Why "mostly identical" is not enough

Action and Article can share 80 percent of the mechanics and still be bad
candidates for a single shared feature component.

That usually happens when:

- one form has more fields than the other
- one form has different required rules
- one form has different publish behavior
- one form needs different error mapping
- one form will likely change on a different schedule

If the shared abstraction starts needing special cases for one content type,
the abstraction is too wide.

## Tiny Worked Examples

### Example: a good shared helper

`validateRequiredString(value, label, max)` can be reused by the Action and
Article editors because it only cares about the generic rule:

- the field is required
- the field must not exceed a max length

That helper does not know anything about content type.

### Example: a bad shared form component

A single `AdminContentEditor` component would look convenient at first.

But once Article needs content-specific copy and another content type needs its
own field family, the component starts accumulating:

- optional props for content type
- branching layout rules
- field-specific conditionals
- error-field exceptions

At that point the shared component is no longer simplifying the codebase.

### Example: a good shared backend error formatter

The Zod issue-to-`BadRequestException` conversion can be shared because the HTTP
error envelope stays the same even when the schema changes.

The schema itself should not be shared unless the request shape is actually the
same.

## How This Appears In The Repo Today

The current Action admin editor already shows the right boundary and is the
closest pattern to copy for the articles PR:

- `apps/web/src/lib/submission-form-validation.ts` holds generic validation
  helpers
- `apps/api/src/action/admin-action.request-schema.ts` holds the Action-specific
  request schema
- `apps/api/src/action/admin-action-validation.pipe.ts` is a small,
  domain-owned pipe wrapper
- `apps/web/src/app/admin/actions/_components/ActionEditorForm.tsx` owns the
  page-specific form state and layout
- the new articles PR should mirror that shape with article-owned files instead
  of trying to retrofit the Action editor into a shared admin content editor

That split is useful because it lets you reuse mechanics without forcing the
Action editor, Article editor, and Event editor into one common shape.

For the articles PR, the article editor should follow the same pattern:

- keep generic validation helpers shared
- keep article request/response mapping local to the article feature
- keep article form state and field ordering local to the article page
- only extract a shared component if the same field structure really repeats
- use the current Action editor as a reference implementation, not as a shared
  base class

## Tiny Rules Of Thumb

1. Share pure helpers first.
2. Share contract types second.
3. Share page components only when the field shape is genuinely the same.
4. Keep validation pipes thin and domain-owned.
5. Prefer duplication over a leaky abstraction when the forms are still
   evolving.

## Recommended Rule For This PR

For Articles, reuse the form mechanics and validation primitives, but keep the
editor contract separate until the article flow proves it wants the same shape
as Actions.

That means:

- reuse the generic string, email, and error-mapping helpers
- reuse the backend validation envelope pattern
- do not create a single cross-content admin editor just to remove a little
  duplication
- extract a shared editor only after two or more content types truly converge

## Next PR Focus

The `admin/articles` PR should likely introduce article-owned files in the same
pattern as Actions:

- `apps/web/src/app/admin/articles/page.tsx` for the list surface
- `apps/web/src/app/admin/articles/new/page.tsx` for create
- `apps/web/src/app/admin/articles/[slug]/page.tsx` for edit
- route-local article editor components under
  `apps/web/src/app/admin/articles/_components/`
- article-specific admin validation and request schema files in the API feature
  folder

That keeps the PR narrow:

- reuse the generic validation primitives
- reuse the API error envelope pattern
- copy the shape of the Action flow only where it truly helps
- do not turn the articles PR into a shared admin editor refactor

## Related Canonical Sources

- [Phase 11 moderation/admin UI spec](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/specs/011-phase-11-moderation-admin-ui.md)
- [Project context](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/agent-governance/project-context.md)
