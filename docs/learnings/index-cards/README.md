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
