# Phase 11.8 Admin Articles Walkthrough

This walkthrough gives the concrete build order for the `admin/articles` PR in
Phase 11.8. It assumes the Action admin flow already exists and that you are
adding the Article admin surface as its own feature, not refactoring Actions
into a shared editor.

## Read Before Editing

- `docs/agent-governance/progress.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/learnings/implementation-guides/phase-11-8-admin-articles-reuse-vs-coupling-guide.md`
- `docs/learnings/implementation-guides/phase-11-moderation-state-and-admin-form-guide.md`
- `docs/learnings/implementation-guides/phase-11-3-editorial-normalization-guide.md`

Reference files to compare against the Action admin flow:

- `apps/api/src/action/admin-action.request-schema.ts`
- `apps/api/src/action/admin-action.validation.ts`
- `apps/api/src/action/admin-action-validation.pipe.ts`
- `apps/api/src/action/admin-action.controller.ts`
- `apps/web/src/app/admin/actions/page.tsx`
- `apps/web/src/app/admin/actions/new/page.tsx`
- `apps/web/src/app/admin/actions/[slug]/page.tsx`
- `apps/web/src/app/admin/actions/_components/ActionEditorForm.tsx`
- `apps/web/src/app/admin/actions/_components/ActionMetadataPanel.tsx`

## Files Likely Involved

Backend:

- `apps/api/src/article/admin-article.request-schema.ts`
- `apps/api/src/article/admin-article.validation.ts`
- `apps/api/src/article/admin-article-validation.pipe.ts`
- `apps/api/src/article/admin-article.controller.ts`
- `apps/api/src/article/admin-article.controller.spec.ts`
- `apps/api/src/article/admin-article.repository.type.ts`
- `apps/api/src/article/article.service.ts`
- `apps/api/src/article/article.service.spec.ts`
- `apps/api/src/article/article.repository.ts`
- `apps/api/src/article/article.repository.spec.ts`

Frontend:

- `apps/web/src/app/admin/articles/page.tsx`
- `apps/web/src/app/admin/articles/new/page.tsx`
- `apps/web/src/app/admin/articles/[slug]/page.tsx`
- `apps/web/src/app/admin/articles/_components/ArticleEditorForm.tsx`
- `apps/web/src/app/admin/articles/_components/ArticleMetadataPanel.tsx`
- `apps/web/src/app/admin/articles/_components/ArticleEditorForm.test.tsx`
- `apps/web/src/app/admin/articles/_components/ArticleMetadataPanel.test.tsx`

Shared support:

- `apps/web/src/lib/submission-form-validation.ts`
- `apps/web/src/lib/api/admin.ts`
- `packages/api-contracts` if the article admin request or response types are not
  already present

## Build Order

### 1. Start from the article contract, not the UI

Before writing route code, decide the article admin request shape from the
Phase 11 spec.

The article editor should follow this canonical field order:

1. title
2. summary
3. content
4. topics
5. status

The important constraints are:

- new articles default to `draft`
- admins may publish directly
- slugs are system-generated and immutable after create
- topics come from the seeded Release 1 topic set

Why first:

This prevents the frontend and backend from drifting into different
assumptions before the feature exists.

### 2. Add the backend request schema and validation pipe

Create the article-specific validation files under `apps/api/src/article/`.

Use the Action admin files as the shape reference, but keep the Article contract
separate.

The article request schema should validate:

- title
- summary
- content
- topic slugs
- status

The validation pipe should stay tiny:

1. parse the request
2. return a typed article admin request on success
3. throw a `BadRequestException` with the repo’s validation error envelope on
   failure

Why second:

The controller and tests need the real article request shape before they can be
wired cleanly.

### 3. Add controller routes for article admin

Mirror the Action admin route pattern for:

- `GET /admin/articles`
- `GET /admin/articles/new`
- `GET /admin/articles/:slug`
- `POST /admin/articles`
- `PUT /admin/articles/:slug`

Keep the controller thin.

It should:

- bind route params
- apply the article validation pipe
- delegate to the service
- return the response the UI needs

Do not push normalization logic into the controller.

Why third:

The controller defines the integration surface, but it should not own the
business rules.

### 4. Extend the article service and repository only where admin needs it

Add the smallest admin-specific methods to the article service and repository.

Likely needs:

- create article
- update article by slug
- fetch article admin detail by slug
- fetch article list for admin review
- load seeded topic selections for the editor

Keep the existing public article read paths separate.

Why fourth:

The public article routes already have a different contract. The admin editor
should not force the public article feature into a generic shared admin layer.

### 5. Build the article list page first

Start with `apps/web/src/app/admin/articles/page.tsx`.

Make it do the simplest useful thing:

- render the page title
- load the admin article list
- show a create link to `/admin/articles/new`
- show row links into `/admin/articles/[slug]`

Use the Action list page as a layout reference, but keep the article labels and
route names article-specific.

Why fifth:

The list page gives you a stable route to land on after create/edit and helps
verify the backend list response early.

### 6. Build the article editor as a route-local component

Create `ArticleEditorForm.tsx` under `apps/web/src/app/admin/articles/_components/`.

Model it after `ActionEditorForm.tsx`, but do not copy Action-specific props or
field assumptions blindly.

The article editor should own:

- local field state
- submit normalization
- required-field checks
- topic selection state
- API error mapping
- in-page success/error banners
- save-as-draft vs publish behavior

The form should keep the first correct article shape:

- title
- summary
- content
- topic checkboxes
- status buttons

Why sixth:

This is the main place where overcoupling usually starts. Keep the component
article-owned so the field family stays obvious.

### 7. Add the create page

Create `apps/web/src/app/admin/articles/new/page.tsx`.

This page should:

- fetch the article editor prerequisites on the server
- render a create header and back link
- pass empty or default initial values into `ArticleEditorForm`

Default create values should reflect the spec:

- empty title, summary, and content
- no topics selected by default
- status set to `draft`

Why seventh:

This gives you one complete entry point for the create flow before you wire
editing.

### 8. Add the edit page

Create `apps/web/src/app/admin/articles/[slug]/page.tsx`.

This page should:

- fetch the article detail by slug
- fetch the seeded topic list
- prefill the editor from the loaded article
- render metadata separately if the design wants read-only context

If you need read-only metadata, create `ArticleMetadataPanel.tsx` rather than
stretching the editor into a mixed read/write surface.

Why eighth:

Edit is a separate route with a separate initial state problem. Keep it route-
local so it stays easy to reason about.

### 9. Add tests alongside the new files

Add focused tests as you build, not after the whole feature is done.

Good early checks:

- request schema accepts valid article payloads
- validation pipe rejects invalid payloads
- article list page renders expected links
- editor preserves values on validation failure
- editor maps API validation errors into inline field errors
- editor keeps save/draft behavior separate

Why ninth:

The tests will tell you quickly if you accidentally imported Action-only
assumptions into the article flow.

### 10. Run focused validation

Run the narrowest useful checks first:

- backend article/admin unit tests
- backend route/controller tests
- frontend article admin component tests
- any touched lint or typecheck targets

Then run the normal repo validation for changed packages.

## First Correct Structure

If you are unsure whether the article admin feature is shaped correctly, the
first correct structure is:

- article-owned files under `apps/web/src/app/admin/articles/`
- article-owned validation files under `apps/api/src/article/`
- shared form helpers reused from `apps/web/src/lib/submission-form-validation.ts`
- no shared cross-content admin editor yet
- no article-to-action coupling just to remove duplication

The article PR is successful when:

- the admin articles list works
- create and edit are separate routes
- validation is consistent with the backend contract
- the editor remains article-specific even though it borrows mechanics from
  Actions

## Ask-When-Stuck Prompts

If you get blocked, ask:

1. Which article fields are actually required by the Phase 11 spec?
2. Am I about to extract a shared component before the article flow has proven
   it needs one?
3. Does this helper belong in `submission-form-validation.ts`, or is it really
   article-specific?
4. Should this live in the article service/repository boundary instead of the
   controller or UI?
5. Is this route-local article code, or am I accidentally building a shared
   abstraction for a single PR?

## Done Checklist

- [ ] Article admin request schema exists
- [ ] Article validation pipe exists
- [ ] Article admin controller exists
- [ ] Article admin list page works
- [ ] Article create page works
- [ ] Article edit page works
- [ ] Article editor stays route-local
- [ ] Shared validation helpers are reused where appropriate
- [ ] No overcoupled cross-content editor was introduced
