# Engineering Decisions Log

Record irreversible or high-impact decisions here.

---

### Decision Entry Template

---

### ► Title

###### YYYY-MM-DD

---

###### Decision:

One paragraph describing the decision

###### Rationale:

- List of reasons why this decision was made

###### Implications:

- List of outcomes this decision enforces or forbids

---

## Decisions

---

---

### ► Platform centers on Actions

###### 2026-03-06

---

###### Decision

The platform centers on **Actions** as the primary domain concept.  
**Events remain a separate entity** representing scheduled real-world participation opportunities.

###### Rationale

- The core purpose of the platform is to help users take concrete civic actions.
- Events are one type of action but contain unique data (time, location).
- Separating Events keeps the data model cleaner.

###### Implications

- Core entities include:
  - Topic
  - Article
  - Action
  - Event
  - Submission

- Articles, Actions, and Events are organized by **Topics**.

---

---

### ► Topics are first‑class entities

###### 2026-03-06

---

###### Decision

Topics are first‑class entities and visible user-facing pages.

###### Rationale

- Topics provide the primary organizational structure for the platform and support discovery.

###### Implications

- Each topic may contain:
  - Articles
  - Actions
  - Events

- Topic pages are publicly visible.

---

---

### ► Curated but community‑extendable model

###### 2026-03-06

---

###### Decision

- The platform accepts community submissions but uses moderation to maintain quality.

###### Implications

- Visitors may submit:
  - Events
  - Articles

- Submissions are anonymous in Release 1.

- All submissions enter a moderation queue.

---

---

### ► Actions are curated

###### 2026-03-06

---

###### Decision

Actions are created by administrators only in Release 1.

###### Rationale

- Actions represent curated civic recommendations.

###### Implications

- Community may submit:
  - Events
  - Articles

- Administrators create and manage Actions.

---

---

### ► Monorepo package manager is pnpm

###### 2026-03-07

---

###### Decision

Phase 1 monorepo package management uses `pnpm`.

###### Rationale

- `pnpm` pairs well with Turborepo for monorepo workflows.
- It provides fast installs and efficient dependency storage.
- Workspace behavior is explicit and reliable for multi-app repos.

###### Implications

- Root workspace scripts should use `pnpm`.
- Setup/run documentation should assume `pnpm` commands.
- CI setup in later Phase 1 tasks should install and use `pnpm`.

---

---

### ► Backend persistence layer will use Prisma ORM

###### 2026-03-08

---

###### Decision

Release 1 backend persistence will use Prisma ORM with PostgreSQL.

###### Rationale

- Fastest path to type-safe persistence, migrations, and productive NestJS integration for the current project scope.

###### Implications

- Phase 2 should standardize on Prisma schema, Prisma Migrate, and Prisma Client patterns for backend data access.

---

---

## Decisions

---

---

### ► CI migration execution deferred to Deployment Infrastructure

###### 2026-03-10

---

###### Decision

Phase 2 requires local end-to-end Prisma migration validation, but CI migration execution that depends on database orchestration is deferred to Phase 12 unless a low-complexity path is available earlier.

###### Rationale

- Phase 2 is focused on backend foundations, not CI infrastructure expansion.
- Adding CI service-database orchestration now introduces avoidable implementation drag.
- Local migration validation already proves schema/migration workflow viability for current scope.

###### Implications

- Phase 2 completion does not require CI database migration execution.
- Phase 12 must define deployment-time and CI migration strategy as part of infrastructure hardening.
- Teams may still add CI migration smoke checks earlier if implementation complexity remains low.
- Phase 2 should avoid implicit Prisma execution hooks in generic workflows (for example `prebuild`/`predev`) and use explicit Prisma commands instead.

---

---

### ► Topics are seeded and immutable in Release 1

###### 2026-03-10

---

###### Decision

Phase 3 will seed the initial Topic dataset, and Topic records will not be editable in Release 1.

###### Rationale

- Topics are the primary discovery structure and should remain stable during initial rollout.
- A fixed set of seeded topics reduces schema and admin-surface complexity in Release 1.

###### Implications

- Phase 3 must include seed data for the initial topics:
  - Democracy - Issues related to democratic institutions, voting rights, election integrity, and civic participation in government.
  - Consumer Activism - Actions focused on influencing corporate behavior through consumer choices such as boycotts, ethical purchasing, and corporate accountability campaigns.
  - Climate - Issues related to climate change, environmental protection, sustainability, and policies affecting the planet’s ecological systems.
  - Civil Rights - Issues involving the protection and advancement of equal rights and liberties, including racial justice, gender equality, LGBTQ+ rights, and disability rights.
  - Economic Justice - Issues related to economic fairness, inequality, labor conditions, housing affordability, wages, and access to economic opportunity.
  - Education - Issues involving public education systems, school policy, curriculum debates, student rights, and education funding.
  - Local Community - Community-level civic engagement including local organizing, mutual aid, neighborhood initiatives, and grassroots participation.
- Release 1 excludes topic editing through admin tooling.
- Topic administration (create/edit/deprecate) is deferred to a post-Release-1 roadmap phase.

---

---

### ► ActionType and EventType use fixed Prisma enums in Release 1

###### 2026-03-11

---

###### Decision

Release 1 will use fixed Prisma enums for `ActionType` and `EventType` rather than admin-managed reference tables. These values are controlled vocabularies for schema validation, filtering, and consistent UI behavior.

###### Rationale

- Release 1 requires a small, stable set of content categories
- Enum values provide stronger consistency than free-text fields
- Admin-managed type systems would add unnecessary scope and UI complexity
- Actions and Events are separate entities and should maintain distinct classification systems

###### Implications

- `ActionType` and `EventType` will be implemented directly in Prisma
- These values are not admin-editable in Release 1
- Frontend code may map enum values to user-friendly display labels
- Detailed editorial guidance for these values may live in docs before being introduced into UI copy later

###### ActionType values

- `GUIDE` — instructional civic action explaining how a user can take action
- `LINK` — action primarily completed by following an external destination
- `CONTACT` — action focused on contacting representatives, officials, organizations, or companies
- `DONATE` — action centered on financial support
- `VOLUNTEER` — action centered on giving time or participating outside a specific scheduled event

###### EventType values

- `PROTEST` — demonstration, march, protest, or direct public action event
- `RALLY` — organized public gathering centered on a cause or campaign
- `VOLUNTEER` — scheduled volunteer/service opportunity
- `TOWN_HALL` — civic or public forum involving officials, organizers, or community participation
- `WORKSHOP` — educational or training-oriented event
- `MEETING` — organizing meeting or general civic gathering

###### Clarification

`ActionType.GUIDE` includes instructional content such as:

- how to reduce personal climate impact
- how to contact representatives
- how to organize a protest
- how to participate in a boycott

---

---

### ► Use Postgres IDENTITY columns in Prisma migration SQL for PKs

###### 2026-03-11

---

###### Decision

For Postgres primary key integer columns generated by Prisma migrations, migration SQL should use:
`INT GENERATED BY DEFAULT AS IDENTITY NOT NULL`
instead of `SERIAL NOT NULL`.

###### Rationale

- `SERIAL` introduced repeat sequence-normalization migrations in local Prisma workflows.
- Explicit identity columns align with modern Postgres behavior and avoid sequence drift loops.
- This keeps migration history stable when running `prisma migrate dev` repeatedly.

###### Implications

- When creating migrations with `--create-only`, review generated SQL and replace `SERIAL` PK definitions with identity-column definitions before applying.
- Do not add manual duplicate sequence creation statements for those identity-backed PKs.
- This convention applies to Phase 3 core-domain tables and future Postgres migrations in this repo.

---

---

### ► Integration tests use ephemeral databases

###### 2026-03-12

---

###### Decision

Backend persistence integration tests will use ephemeral database instances as the immediate strategy for local and CI execution.

###### Rationale

- Phase 3 requires persistence-level confidence, but true integration tests need database isolation from development data.
- Ephemeral databases provide strong isolation without relying on a long-lived shared test database.
- Using the same isolation model locally and in CI reduces environment drift and hidden state between test runs.

###### Implications

- Integration tests must not run against the primary local development database.
- The project should define an ephemeral database creation, migration, and teardown workflow for backend integration tests.
- CI should execute backend integration tests against ephemeral database instances once the Phase 4 test harness is added.
- Test commands should keep unit and integration workflows separable while preserving the same database isolation model across environments.

---

---

### ► Phase 4 integration isolation uses one Postgres container per test run

###### 2026-03-15

---

###### Decision

Phase 4 backend persistence integration tests will use a container-per-run isolation
model through Testcontainers. Each local or CI execution starts a fresh Postgres
container, applies committed migrations, seeds required baseline data, runs tests,
and then stops that container.

###### Rationale

- This is the clearest way to guarantee integration tests cannot mutate the development database.
- It validates the real migration path from empty state on every run.
- It preserves the same logical isolation model across local and CI environments.
- It avoids introducing a long-lived shared test database or a separate admin database-management layer.

###### Implications

- Phase 4 must document the required container runtime contract for local and CI execution.
- Integration test automation must fail closed when pointed at non-test databases.
- CI must provide a working container runtime so Testcontainers can provision transient Postgres infrastructure.
- Unit tests, persistence integration tests, and HTTP smoke tests should remain separately invocable.
- Phase 4 exit criteria require coverage of required Release 1 relationships and baseline uniqueness constraints already present in the Prisma schema.

---

---

### ► Phase 4.3 pilots per-test transaction rollback in the integration harness

###### 2026-03-18

---

###### Decision

Phase 4.3 will evaluate per-test transaction rollback as an integration-test
isolation strategy, starting with a narrow pilot in one spec while retaining the
current truncation-based reset path as the default fallback.

###### Rationale

- The current integration harness uses one ephemeral Postgres database per test run
  and truncates mutable tables after each test.
- That strategy becomes unsafe if integration specs execute concurrently against the
  same database instance because one test can erase another test's data mid-run.
- Per-test rollback may provide safer isolation and faster cleanup, but the repo
  should prove the pattern in a small pilot before adopting it broadly.

###### Implications

- Truncation-based cleanup remains the working fallback until rollback-based test
  isolation is proven stable.
- Phase 4.3 should implement rollback in one integration spec first and document
  the required usage pattern and limitations.
- The harness must clearly define which tests are eligible for rollback-based
  isolation and which still require database reset cleanup.
- Concurrency and worker behavior for integration tests must remain explicit until
  the isolation strategy is standardized across the suite.

---

---

### ► Development seed data is environment-scoped

###### 2026-03-22

---

###### Decision

Prisma seed behavior is environment-scoped. The baseline seed remains
production-safe and inserts only the canonical Topic dataset. Optional demo seed
content may be added for local development environments, but that content must
not be required for production or CI correctness.

###### Rationale

- Local API and UI development benefit from realistic Article, Action, and Event
  data without requiring manual content creation.
- Production seeding should remain minimal, stable, and safe to run repeatedly.
- CI and integration workflows should not depend on heavier demo content unless a
  specific test suite explicitly opts into it.

###### Implications

- Topic seed data remains the baseline seed path for all environments.
- Demo content seed paths are allowed for local development only.
- Seed behavior should default safely to the baseline path when no explicit demo
  mode is selected.
- Production deploy and migration workflows should continue using only the
  baseline seed path.

---

---

### ► Curated learning artifacts live in `docs/learnings/`

###### 2026-03-24

---

###### Decision

The repository includes a visible `docs/learnings/` directory for curated
learning artifacts that show how AI was used to teach and coach implementation
work in the project.

###### Rationale

- Professional development is a core project goal alongside product delivery.
- Repo-visible learning artifacts make the learning process explicit instead of hidden in chat history.
- This supports portfolio review by showing how concepts were learned and applied during real work.
- A curated directory is higher signal than leaving scattered or gitignored learning notes.

###### Implications

- `docs/learnings/` may contain durable syllabi, implementation guides, walkthroughs, concept cards, and concise teaching aids tied to real tasks.
- `docs/learnings/` does not override canonical project authority in governance, architecture, or spec docs.
- `docs/learnings/` is not an agent dumping ground; low-signal or temporary notes belong in `.ai/phase-notes/`.
- Staff Engineer guidance may reference `docs/learnings/` during implementation-oriented sessions.

---

---

### ► User-facing discovery terminology is context-specific but fixed

###### 2026-03-25

---

###### Decision

User-facing discovery terminology is fixed by context. Navigation and page
titles should use the canonical content-type label `Articles`, while in-page
discovery sections may use action-oriented language such as `Learn` or `Learn
More`. `Take Action` remains the standard CTA language for Actions, and
`Related Topics` remains the standard cross-link label for Topics.

###### Rationale

- Consistent terminology makes the public browsing experience feel more
  intentional and easier to understand.
- Navigation and page titles should reflect the actual content type so the
  information architecture stays clear.
- In-page discovery language should feel action-oriented rather than sounding
  like internal content-model terminology.
- Stable CTA and cross-link language reduces UI drift across phases.

###### Implications

- Navigation labels should use `Articles`.
- Article index and detail page titles should use `Articles` where the content
  type itself is being named.
- In-page article discovery sections may use `Learn` or `Learn More`.
- Action CTAs should use `Take Action`.
- Topic relationship blocks should use `Related Topics`.

---

---

### ► Repository name and user-facing product name are distinct

###### 2026-03-25

---

###### Decision

`SignalFire` remains the repository and internal project name, while
`CivicSignal` is the user-facing site and product name used in the public UI,
metadata, and other externally visible product language.

###### Rationale

- The repository is already established under the name `SignalFire`.
- The public product language should be free to evolve independently from the
  repository name.
- Making the distinction explicit avoids drift between internal references and
  user-facing branding.

###### Implications

- Public UI copy should use `CivicSignal` unless there is a specific internal or
  technical reason to reference the repository name.
- Page metadata and browser-visible naming should use `CivicSignal`.
- Internal documentation, repo paths, and implementation references may still
  use `SignalFire` where the repository/project identity is what matters.
