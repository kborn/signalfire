# Learning Cards

Tiny reminders for stack concepts that are easy to forget.

These cards may be created or updated alongside task-linked syllabi in
`docs/learnings/syllabi/`, implementation guides in
`docs/learnings/implementation-guides/`, or walkthroughs in
`docs/learnings/walkthroughs/` when a concept is likely to recur.

## Start Here

- [09-java-to-node-critical-path.md](./09-java-to-node-critical-path.md) - Short list of the most important concepts to internalize first
- [10-event-loop-mental-model.md](./10-event-loop-mental-model.md) - Why blocking work is dangerous in Node
- [11-promises-async-await.md](./11-promises-async-await.md) - What promises, `async`, and `await` actually mean
- [12-nest-wiring-vs-logic.md](./12-nest-wiring-vs-logic.md) - How to separate Nest module wiring from business code
- [13-ts-is-not-java.md](./13-ts-is-not-java.md) - The TypeScript mindset shift most Java developers trip over
- [14-who-tracks-async-work.md](./14-who-tracks-async-work.md) - Event loop, promises, and runtime roles
- [15-sequential-vs-parallel-awaits.md](./15-sequential-vs-parallel-awaits.md) - Why independent async queries should often start together

## Cards

- [01-nest-modules.md](./01-nest-modules.md) - What a Nest module does, and what `imports`, `providers`, and `exports` mean
- [01b-module-fields.md](./01b-module-fields.md) - What `imports`, `providers`, `exports`, and `controllers` mean inside a Nest module
- [02-nest-di-vs-ts-imports.md](./02-nest-di-vs-ts-imports.md) - The difference between TypeScript imports and Nest dependency injection
- [03-prisma-generated-client.md](./03-prisma-generated-client.md) - Where Prisma comes from in this repo and how schema becomes client code
- [04-repository-vs-service.md](./04-repository-vs-service.md) - How repository and service responsibilities differ in this project
- [05-stack-definitions.md](./05-stack-definitions.md) - What Node, TypeScript, Nest, Next, pnpm, and related stack terms mean
- [06-cli-tool-cheatsheet.md](./06-cli-tool-cheatsheet.md) - What common JS/TS CLI tools do and when to use them
- [07-node-blocking-vs-async.md](./07-node-blocking-vs-async.md) - What blocks a Node app and what does not
- [08-async-does-not-fix-cpu.md](./08-async-does-not-fix-cpu.md) - Why `async` does not make CPU-heavy synchronous work non-blocking
- [14-who-tracks-async-work.md](./14-who-tracks-async-work.md) - Who coordinates pending async work in Node
- [15-sequential-vs-parallel-awaits.md](./15-sequential-vs-parallel-awaits.md) - Sequential vs parallel async request patterns
- [16-layout-vs-page-in-next-app-router.md](./16-layout-vs-page-in-next-app-router.md) - What belongs in `layout.tsx` vs `page.tsx` in the Next App Router
- [17-dynamic-slug-routes.md](./17-dynamic-slug-routes.md) - How `[slug]` folders map to dynamic route values
- [18-semantic-html-page-structure.md](./18-semantic-html-page-structure.md) - What `header`, `nav`, `main`, and `section` mean in page structure
- [19-div-vs-section-vs-main.md](./19-div-vs-section-vs-main.md) - When to use `div`, `section`, and `main`
- [20-layout-containers.md](./20-layout-containers.md) - What a shared layout container does
- [21-spacing-and-vertical-rhythm.md](./21-spacing-and-vertical-rhythm.md) - Why consistent spacing matters before polish
- [22-css-class-selectors.md](./22-css-class-selectors.md) - How CSS classes connect styles to JSX elements
- [23-server-page-fetching-in-next-app-router.md](./23-server-page-fetching-in-next-app-router.md) - Why App Router pages can fetch data directly on the server
- [24-collection-vs-detail-api-shapes.md](./24-collection-vs-detail-api-shapes.md) - Why collection and detail endpoints should not be treated as the same payload shape
- [25-render-related-summaries-as-links.md](./25-render-related-summaries-as-links.md) - Why embedded related summaries should become clickable discovery links
- [26-summary-cards-vs-card-systems.md](./26-summary-cards-vs-card-systems.md) - When a simple repeated summary block is enough and when a real card system starts to exist
- [27-await-looks-sequential-but-is-still-async.md](./27-await-looks-sequential-but-is-still-async.md) - Why `await` reads sequentially without turning I/O into blocking synchronous work
- [28-react-list-keys.md](./28-react-list-keys.md) - Why React needs stable `key` values for items rendered from `.map(...)`
- [29-jsx-inline-style-syntax.md](./29-jsx-inline-style-syntax.md) - How inline styles work in JSX and why raw CSS syntax does not belong in element attributes
- [30-rem-vs-em-vs-px.md](./30-rem-vs-em-vs-px.md) - What `rem`, `em`, and `px` mean and when each unit is a better fit
- [31-ts-constructor-parameter-properties.md](./31-ts-constructor-parameter-properties.md) - How `public status: number` in a constructor creates an instance field automatically
- [32-triple-equals-vs-double-equals.md](./32-triple-equals-vs-double-equals.md) - Why `===` is the normal equality operator and how it differs from `==`
- [33-default-function-exports.md](./33-default-function-exports.md) - What `export default function` means and why Next route files use it
- [34-next-special-route-files-and-nearest-wins.md](./34-next-special-route-files-and-nearest-wins.md) - Which App Router filenames are special and how route-local files override broader ones
- [35-markdown-storage-vs-rendering-boundary.md](./35-markdown-storage-vs-rendering-boundary.md) - Keep Markdown as source text and render it at the article display boundary
- [36-jsx-uppercase-means-component.md](./36-jsx-uppercase-means-component.md) - Why capitalized JSX tags call React components instead of rendering HTML elements
- [37-css-pseudo-classes.md](./37-css-pseudo-classes.md) - How selectors like `.primaryCTA:hover` attach state-specific styles to the same element
- [38-ts-structural-typing-vs-java-nominal-typing.md](./38-ts-structural-typing-vs-java-nominal-typing.md) - Why TypeScript can reuse values across types when their field shapes match
- [39-nest-query-vs-param.md](./39-nest-query-vs-param.md) - When Nest route values should come from `@Param(...)` versus `@Query(...)`
- [40-optional-parameter-vs-undefined-union.md](./40-optional-parameter-vs-undefined-union.md) - When `value?: T` means something different from `value: T | undefined`
- [41-module-exports-vs-class-visibility.md](./41-module-exports-vs-class-visibility.md) - How `export` differs from `public` and `private` on classes
- [42-arrow-functions-vs-function-expressions.md](./42-arrow-functions-vs-function-expressions.md) - When arrow functions and `function` expressions are interchangeable and when `this` changes the behavior
- [46-css-descendant-and-attribute-selectors.md](./46-css-descendant-and-attribute-selectors.md) - How selectors like `.site-nav a[aria-current='page']` combine nesting and attribute matching
- [47-aria-current-and-active-nav.md](./47-aria-current-and-active-nav.md) - Why `aria-current="page"` marks the current nav link semantically and visually
- [48-grouped-selectors-and-rule-overlap.md](./48-grouped-selectors-and-rule-overlap.md) - How `html, body { ... }` and `body { ... }` interact when both set styles
- [49-html-vs-body.md](./49-html-vs-body.md) - What `html` and `body` each represent in the page structure
- [50-direct-child-vs-descendant-selectors.md](./50-direct-child-vs-descendant-selectors.md) - How `.parent > *` differs from `.parent *`
- [51-css-media-queries.md](./51-css-media-queries.md) - What `@media` does and why it is not the same thing as mobile by itself
- [52-shared-component-variants-by-layout-context.md](./52-shared-component-variants-by-layout-context.md) - When one summary component should expose `collection` vs `related` presentation explicitly
- [53-prisma-nested-writes-for-join-tables.md](./53-prisma-nested-writes-for-join-tables.md) - How to create owned join rows for submissions with `connect` and `connectOrCreate`
- [54-nest-pipes.md](./54-nest-pipes.md) - What a Nest pipe does and why it runs before a controller method
- [55-zod-runtime-vs-ts-compile-time.md](./55-zod-runtime-vs-ts-compile-time.md) - Why TypeScript types do not replace runtime request validation
- [56-zod-discriminated-unions.md](./56-zod-discriminated-unions.md) - When one field such as `submissionType` determines the rest of the schema
- [57-server-page-plus-client-form-boundary.md](./57-server-page-plus-client-form-boundary.md) - Keep initial page data on the server and move only the interactive form to the client
- [58-controlled-inputs-in-react.md](./58-controlled-inputs-in-react.md) - Let React state own the current value when form UX depends on validation and submit state
- [59-plain-react-form-vs-form-library.md](./59-plain-react-form-vs-form-library.md) - Learn the plain form mechanics before adding library abstraction
- [60-react-component-props-object.md](./60-react-component-props-object.md) - JSX attributes become one props object, not separate function arguments

Rule of thumb:

- TS import problem?
- Nest DI problem?
- Prisma problem?
- project architecture problem?

Card guidelines:

- Keep cards short enough to re-read in under a minute.
- Prefer one durable concept per card.
- Update an existing card instead of creating a duplicate whenever possible.
- This directory is curated; do not use it for throwaway session notes.
