# Engineering Decisions Log

Record irreversible or high-impact decisions here.

---

### ► Development Approach: Shift from Learning-Oriented to Autonomous Completion

###### 2026-06-19

---

###### Decision

The development model for this project changed from learning-oriented (human implements, AI coaches)
to autonomous-completion (AI implements, human reviews). The agent now writes code, commits, creates
branches, and makes implementation decisions without requiring per-step human approval. The human's
role is to review completed work and extract learnings after the fact rather than during implementation.

###### Rationale

- The original learning-oriented approach was appropriate for Phases 0–12, where building comprehension
  of the stack was an explicit goal alongside building the product.
- By Phase 13, the core stack (Next.js, NestJS, Prisma, Turborepo) is understood and the remaining
  work is completion-oriented — fixing quality gaps, closing deferrals, and getting to a deployable state.
- Agentic coding is a professional skill in its own right. Practicing autonomous agent operation
  (reviewing agent output, correcting regressions, directing scope) is itself the learning artifact.
- The governance overhead (7-file bootstrap, BOOTSTRAP_COMPLETE ceremony, "no autonomous code"
  constraint) was slowing sessions and producing no benefit at this stage of the project.

###### Implications

- `CLAUDE.md` now describes autonomous-completion mode with minimal ceremony.
- Agents write code, commit, and branch without asking. Pushes still require explicit user confirmation.
- `CONTEXT-next-session.md` (repo root) is the primary handoff document between sessions.
- The STAFF_ENGINEER role file and ai-usage.md are superseded for implementation work; they remain
  as historical reference but agents should not apply their constraints.
- Learnings are extracted in a dedicated review at the end of a work block, not inline during
  implementation.
- The user may shift back to learning-oriented mode at any time by updating CLAUDE.md.

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

Phase 2 requires local end-to-end Prisma migration validation, but CI migration execution that depends on database orchestration is deferred to Phase 14 unless a low-complexity path is available earlier.

###### Rationale

- Phase 2 is focused on backend foundations, not CI infrastructure expansion.
- Adding CI service-database orchestration now introduces avoidable implementation drag.
- Local migration validation already proves schema/migration workflow viability for current scope.

###### Implications

- Phase 2 completion does not require CI database migration execution.
- Phase 14 must define deployment-time and CI migration strategy as part of infrastructure hardening.
- Teams may still add CI migration smoke checks earlier if implementation complexity remains low.
- Phase 2 should avoid implicit Prisma execution hooks in generic workflows (for example `prebuild`/`predev`) and use explicit Prisma commands instead.

---

---

### ► Moderation and admin tooling are one Release 1 phase

###### 2026-04-28

---

###### Decision

Release 1 combines moderation workflow implementation and essential admin editing into a single phase and a single internal interface surface. During local-only and non-deployed development, that interface may be left openly reachable. Before deployment to any environment intended for real users, the interface must be protected by authentication/authorization.

###### Rationale

- The previous split between "Moderation Workflow" and "Admin Interface" created an artificial sequencing conflict because moderation is itself an admin function.
- The project is not currently deployed, so requiring auth before moderation implementation would add drag without improving current safety.
- A single phase better matches the actual dependency graph: moderation queue, review actions, and basic editorial/admin tools will be built together on one surface.

###### Implications

- Phase 11 is now `Moderation & Admin Interface`.
- Search/discovery and later phases shift down by one phase number.
- Canonical docs should treat access hardening for this interface as a deployment-readiness concern, not as a prerequisite for building the interface locally.
- Any deployed environment for real users must place the moderation/admin interface behind authentication/authorization before launch.

---

---

### ► Release 1 admin auth uses cookie-backed per-user sessions

###### 2026-06-06

---

###### Decision

Release 1 admin authentication will use per-user login sessions carried by
cookies rather than bearer tokens or a shared web-to-API credential. Admin
users authenticate once, the browser stores the resulting session cookie, and
subsequent admin requests present that cookie so the API can validate the
logged-in admin user on each request.

###### Rationale

- The admin surface is browser-based and internal, not a public third-party API product.
- Cookie-backed sessions fit the existing Next web app plus Nest API model with less client-side auth state complexity than bearer tokens.
- Per-user sessions preserve request-level admin identity at the API boundary.
- This avoids resending raw credentials on every request and avoids trusting a single shared app credential for all admin traffic.

###### Implications

- Admin login should establish a secure session cookie rather than returning a long-lived browser-managed bearer token as the primary Release 1 mechanism.
- Admin API routes must validate the session presented on each request.
- Web-layer route protection and API-layer authorization are both required.
- Release 1 auth docs and implementation should teach cookie/session behavior as the primary mental model.

---

---

### ► Release 1 admin access uses one manually managed AdminUser model

###### 2026-06-06

---

###### Decision

Release 1 admin access uses a single internal `AdminUser` model with no
moderator/admin permission split. Admin users may be provisioned and managed
manually through database, seed, or one-off script operations for the initial
release.

###### Rationale

- Current Release 1 scope does not require distinct permission levels inside the admin surface.
- Manual admin-user management is sufficient for a small trusted operator set.
- Avoids expanding scope into public signup, invitations, password reset, or admin-user CRUD UI.
- Keeps the first auth implementation narrow enough to finish in Phase 11.9.

###### Implications

- All protected `/admin` routes and admin APIs should require an authenticated `AdminUser`.
- Release 1 does not include public signup, invite flows, password reset flows, or admin-user management UI.
- Admin-user creation and lifecycle operations may be performed through database records, seed data, or controlled scripts.
- Future role splits or broader account-management workflows require explicit scope changes.

---

---

### ► Release 1 admin sessions are database-backed

###### 2026-06-06

---

###### Decision

Release 1 admin sessions will be database-backed. The admin auth cookie will
carry a session identifier, and the API will resolve that identifier against a
server-managed session record to determine the current authenticated
`AdminUser`.

###### Rationale

- Database-backed sessions provide the clearest learning path for understanding login, cookie transport, server-side session lookup, logout, and invalidation.
- They make session revocation and operational debugging easier than signed-cookie sessions.
- The additional database lookup is acceptable for the small internal admin surface in Release 1.
- This keeps the cookie payload simple because it only needs to carry a session identifier rather than signed session state.

###### Implications

- Release 1 should add an admin session persistence model in addition to `AdminUser`.
- Admin logout should invalidate the backing session record and clear the cookie.
- Admin request authentication should read the cookie, load the session record, then load or resolve the current `AdminUser`.
- Release 1 should align cookie lifetime with the rolling server-side session lifetime for the clearest behavior and easiest debugging.
- Signed-cookie session design is deferred as a later learning or comparison exercise, not the primary Release 1 implementation path.
- A scheduled expired-session cleanup job is deferred as a later operational or learning enhancement; Release 1 expiration enforcement happens during request-time session validation.

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

###### Deferred follow-up

- TODO: evaluate adding `VOTE` to `EventType` in a later phase when expanding the Release 1 event taxonomy warrants the schema, API-contract, seed-data, and UI-label updates that enum change would require.

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
- After editing the generated migration SQL, apply it by running the normal Prisma migration command again without `--create-only` so Prisma executes the reviewed migration against the database.
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

###### Superseded

This public-name decision is superseded by `Public product name is Find Your
Fight` dated 2026-05-27. It remains recorded here as historical context for
completed UI work.

---

---

### ► Public product name is Find Your Fight

###### 2026-05-27

---

###### Decision

`Find Your Fight` is the public product name for Phase 11.5 and subsequent
public-facing work. It replaces `CivicSignal` in public UI copy, metadata, and
branding when those surfaces are updated through the active visual-identity
work. `SignalFire` remains the repository and internal project name.

The public identity is grounded in focused civic participation: people may be
overwhelmed or paralyzed when many issues compete for their attention, and the
product helps them select an issue that matters to them, understand it, and
take concrete action.

###### Rationale

- `Find Your Fight` communicates the product promise directly rather than
  requiring an abstract name to be explained.
- The name aligns with the existing Learn -> Decide -> Act platform model and
  places personal agency at the beginning of the user journey.
- The identity acknowledges attention overload without requiring visitors to
  respond to every issue before taking meaningful action.
- The approved philosophy supports a public About page that explains the
  product without introducing new backend behavior or community features.

###### Implications

- New or refreshed public branding, metadata, and navigation-adjacent copy
  should use `Find Your Fight` rather than `CivicSignal`.
- Phase 11.5 must include a public About surface that explains focused
  participation as the product philosophy.
- Public messaging should communicate that choosing a focus enables action; it
  must not suggest indifference, social networking, or platform-hosted
  organizing functionality that does not exist.
- Topics should be presented as the natural starting point for visitors seeking
  to identify an issue, while Articles, Actions, and Events support learning
  and participation.
- `findmyfight.com` is a candidate domain only and does not define product
  scope or deployment readiness.

---

---

### ► Local app env files use `.env.local`

###### 2026-03-26

---

###### Decision

Local development environment files are app-owned and use `.env.local` naming
for both the web and API apps.

###### Rationale

- The monorepo now has separate runtime responsibilities for `apps/web` and
  `apps/api`.
- App-owned local env files reduce ambiguity compared with relying on a single
  root `.env`.
- Using the same `.env.local` convention in both apps keeps local setup
  consistent.

###### Implications

- Local web runtime configuration should live in `apps/web/.env.local`.
- Local API runtime and Prisma configuration should live in
  `apps/api/.env.local`.
- Root `.env.example` acts as a pointer to app-owned env files rather than as
  the primary local runtime contract.

---

---

### ► Public Event discovery uses a simplified upcoming list contract

###### 2026-03-29

---

###### Decision

Public Event discovery should use a simplified Events list contract. The public
`/events` collection should return upcoming published Events by default,
covering roughly now through the next three months, sorted by `startTime`
ascending and then `id` ascending, and accept only an optional `topicSlug`
filter. The public Event detail endpoint remains unchanged. Topic detail pages
should not embed unfiltered Event arrays and may link users into the filtered
Events surface using `topicSlug` passthrough navigation.

###### Rationale

- Events are geographically and temporally constrained in a way Articles and
  Actions are not.
- For public browsing, requiring region/date inputs up front creates needless
  friction for the initial Events surface.
- A default upcoming window better matches the core user question of "what can
  I do soon?" without requiring extra UI or query construction.
- Topic filtering remains useful for intent-based discovery and can be passed
  through cleanly from Topic pages.
- Dumping Event cards inline on broad Topic pages is weak discovery and mixes
  two separate browsing surfaces.
- Keeping Event discovery on the filtered Events surface preserves a clearer
  mental model for location- and time-aware browsing.
- Keeping Event detail unchanged avoids unnecessary churn where the existing
  detail contract already meets current UI needs.

###### Implications

- Topic detail API payloads should not add embedded Event summary arrays for
  Release 1.
- The public Events collection contract should not require `region`,
  `startDate`, or `endDate` inputs.
- The public Events collection should default to an upcoming time window of
  roughly now through the next three months.
- `topicSlug` is the only public collection filter required in Release 1.
- Internal implementation may still use broader filtering concepts if needed,
  but those inputs are not part of the public contract.
- Topic pages may include lightweight passthrough links such as `Find Events`
  or `Browse events for this topic` that route users to filtered Event
  discovery views such as `/events?topicSlug=<slug>`.
- Those passthrough links do not require Topic API payload changes or embedded
  Event lists.
- The public Event detail endpoint remains unchanged, including related Topic,
  Article, and Action summaries.
- Richer presentation treatment and stronger CTA polish for Topic-page Event
  entry points remain Phase 9 work rather than baseline Phase 8 scope.

---

### ► Public Event discovery shifts to a filter-led finder flow

###### 2026-06-13

---

###### Decision

Phase 12 public Event discovery should shift from default broad browse behavior
to a filter-led finder flow. The public `/events` page should not render a
generic Event list before the user supplies a meaningful filter set in URL
state. Approved public Event filters remain limited to Topic, date/date window,
and broad location fields already supported by the Event contract.

###### Rationale

- The team no longer considers a broad default Event list useful enough to
  justify making it the initial public experience.
- Event discovery is more intent-driven than Article or Action browsing because
  users usually care about both where and roughly when something happens.
- Moving the public page to a filter-led model avoids spending Phase 12 effort
  on behavior that is likely to be reversed before Milestone 1 is complete.
- The existing query-param direction still provides a durable base for later UI
  refinement without forcing a new endpoint or payload model.

###### Implications

- Phase 12.3 should define `/events` as a filter-led public discovery surface.
- The Events page may render a pre-results state on initial load instead of a
  default broad Event collection.
- Event API validation should continue to validate provided filter inputs, while
  the page layer decides when the current URL state is sufficient to run a
  query.
- Deterministic filtered ordering and published-only visibility remain in force
  once a query is executed.
- This decision supersedes the default-browse page behavior described in the
  earlier simplified upcoming list decision, while leaving Event detail payload
  shape and filtered ordering semantics intact.

---

---

### ► Event submissions use a canonical website URL; article submissions retain moderation links

###### 2026-04-06

---

###### Decision

Submission persistence distinguishes between article support links and event
public URLs. Article submissions may include optional `resourceLinks` for
moderation context. Event submissions may include one optional `websiteUrl`
representing the public event, organizer, or RSVP URL and that field should map
to the published Event model on approval.

###### Rationale

- Article submissions still benefit from optional supporting sources or
  references that help moderators validate claims without extracting URLs from
  prose.
- Event submissions are materially different: a single public-facing event or
  organizer URL is a stable part of the published event record, not just
  moderation context.
- Using one canonical event URL avoids ambiguous multi-link event submissions
  and gives moderation a direct mapping target for approved Event records.
- Article and event submissions may diverge where the public publishing model
  genuinely differs.

###### Implications

- Article submission contracts and persistence should continue to support the
  moderation-only URL collection `resourceLinks`.
- Event submission contracts should use one optional scalar field:
  `websiteUrl`.
- Event submissions should not use `resourceLinks`.
- Approved event submissions should map `websiteUrl` to the published Event
  model's website field.

---

---

### ► Article submission UI exposes Author separately from submitter contact

###### 2026-04-23

---

###### Decision

Phase 10 article submission UI may expose an optional `Author` field separately
from `Submitter Name` and `Submitter Email`. This is a UI labeling decision for
clarity during public submission and does not introduce an author-management
system.

###### Rationale

- Article submissions can reasonably be sent by someone other than the credited
  author.
- Distinct submitter labeling makes the moderation-follow-up purpose more
  obvious than a generic `Name` field.
- Keeping this distinction in article UI does not require broader authorship or
  identity workflows in Release 1.

###### Implications

- Phase 10 article submission docs and UI should use `Author`, `Submitter
Name`, and `Submitter Email` when this distinction is shown.
- `submitterName` and `submitterEmail` remain moderation-only fields.
- This does not require the same labeling for event submissions unless a later
  decision extends it.

---

---

### ► Phase 10.3 submission request validation uses Zod in narrow scope

###### 2026-04-09

---

###### Decision

Phase 10.3 request validation for `POST /submissions` will use Zod at the API
boundary. This adoption is intentionally narrow: Zod is introduced only for the
submission creation endpoint and does not establish a repo-wide validation
strategy.

###### Rationale

- The submission API request is a discriminated union over `submissionType`
  with different article and event payload requirements.
- Runtime validation is required at the public API boundary because TypeScript
  request types alone do not validate incoming JSON.
- Zod expresses discriminated unions more directly than decorator-heavy DTO
  patterns for this specific endpoint.
- The narrower adoption path provides learning value without expanding Phase
  10.3 into a broad framework migration.

###### Implications

- Phase 10.3 should validate `POST /submissions` request shape at runtime
  before service logic executes.
- Validation errors returned from the submission endpoint must still match the
  Phase 10 submission API error contract.
- Domain checks that require repository access, such as approved topic slug
  validation, remain service-layer concerns.
- This decision does not require refactoring existing controllers or defining a
  general Zod standard for all API endpoints.

---

---

### ► Event location publication uses structured address lines plus supplemental guidance

###### 2026-05-16

---

###### Decision

Release 1 Event publication separates structured geographic fields from
optional public-facing location guidance. The canonical Event location model
uses `locationName`, `addressLine1`, `addressLine2`, `city`, `region`,
`country`, `postalCode`, and `publicLocationDescription`. The previous
`addressRaw` field is removed from the Release 1 canonical Event and event
submission contracts before launch.

This supersedes the earlier Phase 10 event submission mapping where
`locationAddressStreet` contributed to a derived `addressRaw` display field.
Going forward, street-level input maps to `addressLine1`; `addressLine2` is
available for additional address detail; and supplemental public guidance maps
to `publicLocationDescription`.

###### Rationale

- Events may be venue-based, route-based, approximate-location, or
  privacy-preserving civic gatherings.
- A single `addressRaw` field conflates street addresses, broad location text,
  display formatting, and moderator-entered guidance.
- Structured geography is still needed for Release 1 discoverability and future
  location-aware browsing.
- Optional public guidance is useful for protests, marches, RSVP/private
  locations, and organizer instructions without replacing structured geography.
- Online-only Events remain out of Release 1 scope and should be handled in a
  future product decision.

###### Implications

- `city`, `region`, `country`, and `postalCode` remain required for Release 1
  Event publication and moderation normalization.
- Event geographic fields may remain nullable in Prisma to preserve a clean
  future path for online or geography-free events, but Release 1 API contracts,
  moderation approval validation, and admin publication flows enforce them as
  required.
- `addressLine1`, `addressLine2`, and `publicLocationDescription` are optional.
- `publicLocationDescription` is supplemental public guidance; it is not an
  address override and does not replace structured location fields.
- Public Event detail pages should render location information in this order:
  `locationName`, `publicLocationDescription` when present, `addressLine1` and
  `addressLine2` when present, then city/region/postal/country.
- Existing Phase 10 names should be migrated as follows:
  `locationAddressStreet` -> `addressLine1`; no canonical
  `locationAddressRaw` field exists; previous `addressRaw` usage is removed
  rather than renamed.
- Phase 11.3 must update Event persistence, submission persistence, API
  contracts, moderation normalization forms, approval mapping, seed data, and
  public Event rendering to remove `addressRaw` as a canonical field.

---

---

### ► Event summary, description, and postal code remain required in Release 1

###### 2026-05-28

---

###### Decision

For Release 1, Event `summary`, `description`, and `postalCode` are required in
the public submission contract and in moderation normalization before approval.
They must not be treated as optional in canonical specs, API contracts, or UI
validation rules.

###### Rationale

- Event discovery and moderation quality in Release 1 relies on all three
  fields being present and reviewable.
- Optional treatment across docs previously created conflicting implementation
  guidance and test expectations.
- The project already enforces required Event `postalCode` in Release 1
  publication decisions; this keeps submission and normalization aligned.

###### Implications

- Phase 10 submission spec must define `locationAddressZip` as required.
- Phase 11 moderation/admin spec must define Event `summary`, `description`,
  and `postalCode` as required normalization fields.
- Learning guides may discuss nullable persistence internals, but they must not
  represent these fields as optional in Release 1 behavior.

---

---

### ► Phase 12.4 public discovery uses explicit page-number pagination

###### 2026-06-15

---

###### Decision

Phase 12.4 public discovery should use explicit page-number pagination across
public collection surfaces rather than infinite scroll.

###### Rationale

- Public discovery in SignalFire is a browse-and-return flow: users will often
  open an article, action, or event from a collection page and then come back
  to continue browsing.
- Infinite scroll makes that return path brittle because the browser back flow
  commonly drops the user at the top of the list or loses the previously loaded
  depth, forcing them to rebuild context.
- Explicit pages create a stable URL and stable position for each slice of the
  collection, which is easier to share, revisit, test, and reason about in a
  content-discovery product.

###### Implications

- Public collection query params should use `page` and `pageSize` rather than a
  cursor contract.
- Public collection responses should return page-oriented metadata sufficient
  for previous/next and numbered-page behavior.
- Phase 12 docs and learning materials should teach URL-driven pagination
  rather than client-side append behavior.

---

---

### ► Public Event city filter uses debounced URL commits

###### 2026-06-16

---

###### Decision

The public Events finder should keep `region`, `startDate`, `endDate`, topic,
pagination, and page-size state URL-driven, while the `city` input uses a
small local draft state with debounced commits back into the URL.

###### Rationale

- The project is intentionally serving as a learning vehicle, and this
  component is an appropriate place to learn `useEffect` cleanup and debounced
  state synchronization in a bounded way.
- The debounced city field feels smoother than `blur`-only commits while
  avoiding an unnecessary Apply/Reset workflow for a relatively lightweight
  civic browsing surface.
- URL state remains the committed source of truth for shareability, refresh
  behavior, and server-rendered data fetching.

###### Implications

- The `city` field may keep a short-lived local draft value while typing.
- Debounced city commits must preserve the rest of the active Event query state
  and reset `page` when the filter changes.
- `region`, `startDate`, and `endDate` may continue to commit immediately.
- This is an intentional product and learning tradeoff, not an accidental
  inconsistency in filter implementation.

---

---

### ► Milestone 1 public demo is explicit, self-contained, and reviewer-oriented

###### 2026-06-16

---

###### Decision

The Milestone 1 public experience should explicitly present itself as a demo.
The homepage will carry a dismissible demo banner, the site chrome will retain
a subtle persistent demo indicator, and the product will expose a dedicated
public `/demo` page that explains the portfolio/demo posture and links reviewers
to admin demo access instructions. The global `Admin Demo` entry point should
live in the header only.

###### Rationale

- Reviewers should not have to infer whether the site is a live public product,
  a mockup, or a portfolio demonstration.
- Demo/admin access should be discoverable from within the product rather than
  assuming the reviewer arrived through the repository first.
- A dedicated `/demo` page keeps the homepage clear of operational detail while
  still making the product self-contained for first-time visitors.
- A single header-level `Admin Demo` affordance is enough to make the admin
  surface discoverable without turning the public site chrome into a demo
  directory.

###### Implications

- The homepage banner should frame the experience briefly without turning the
  homepage into an explanatory wall.
- The header, footer, or equivalent shared chrome should retain a small demo
  affordance after the homepage banner is dismissed.
- `Admin Demo` should be visible in the product, with the `/demo` page serving
  as the canonical path to credentials or access instructions.
- Demo messaging must be honest about the portfolio nature of the site and
  should not imply a currently active live community if that is not true.
- The `/demo` page should stay concise: short demo framing, limited-data note,
  admin-demo access instructions, and links to the repository and key product
  surfaces are sufficient.

---

---

### ► Milestone 1 Event demo data favors discoverability over full geographic coverage

###### 2026-06-16

---

###### Decision

The public Events demo should prefer reliable discoverability over exhaustive
state coverage. Demo data should guarantee meaningful Event results for a
bounded set of prominently available regions, rather than attempting to seed a
thin nationwide distribution. Unsupported regions may remain visible in the
selector, but they should be disabled.

###### Rationale

- Reviewers should be able to find Event results quickly without trying many
  states or assuming the filter is broken.
- Seeding broad but shallow nationwide Event coverage would add substantial
  content overhead without materially improving Milestone 1 evaluation.
- A bounded state set allows stronger topic spread, date spread, and denser
  examples in the places reviewers are most likely to explore.
- Keeping at least one territory in the supported set proves the selector and
  data model are not implicitly “states only.”

###### Implications

- The Event region selector may intentionally expose unsupported regions in a
  disabled state while keeping only the seeded regions selectable.
- Demo seed planning should ensure each visible state has a credible spread of
  upcoming and past events across multiple topics.
- Articles and Actions may remain broader, but the Event finder should rarely
  dead-end for normal reviewer exploration.
- The initial supported Event demo region set should include a small bounded
  mix such as California, New York, Pennsylvania, Texas, and Puerto Rico,
  unless implementation or content-review needs justify a nearby substitute.

---

---

### ► Periodic site reviews live in `docs/reviews/` and are non-canonical

###### 2026-06-18

---

###### Decision

The project maintains a series of dated site review documents in `docs/reviews/`. Each review scores the product across Visual Design, UX/Product, and Engineering dimensions and produces a prioritized fix list. Review findings inform phase task creation but do not override canonical governance, architecture, or spec documents.

###### Rationale

- Periodic external-perspective reviews catch gaps that canonical docs and active implementation work tend to miss.
- Keeping reviews in a dedicated directory prevents them from being mistaken for canonical authority and prevents bootstrap read chains from accidentally loading them as project state.
- Dating each file by review date makes the series chronologically navigable and prevents stale findings from being acted on as current observations.

###### Implications

- `docs/reviews/` is non-canonical. Agents must not cite review documents in architecture decisions, spec documents, or governance docs.
- Findings from a review should be promoted into a canonical phase subphase (e.g. Phase 13.6) before implementation begins. The review document itself is the source record; the phase entry is the implementation authority.
- `docs/reviews/REVIEW_TEMPLATE.md` defines the standard format for future reviews.

---

### ► Events page: show geographically random events by default

###### 2026-06-19

---

###### Decision

The `/events` page shows publicly available upcoming events without any location filtering by default. Events shown may not be geographically relevant to the visitor.

###### Rationale

- Showing an empty state on landing (before any location is selected) is a poor first impression for a portfolio reviewer who may not invest time in configuring a preference.
- A live civic action platform would use IP geolocation, a saved preference, or a region picker to surface locally relevant events on first load. This is the correct production approach.
- For Milestone 1 (portfolio deployment), the tradeoff favors visible content over geographically accurate content.

###### Implications

- Do not "fix" the events default experience without replacing it with a proper geo-aware implementation.
- A production release should implement IP geolocation lookup or a user-saved region preference before showing regional events as default content.
- A review document represents the state of the product at a single point in time. Before acting on a specific finding, verify it still applies to the current codebase.
- The events filter form appearing before event results is also intentional for Milestone 1. In a geo-aware production release, the filter would be pre-populated from the user's location and results would appear immediately. Until that implementation exists, the filter-first UX is the correct placeholder — it explains the bounded demo geography and invites the reviewer to explore. Collapsing the filters or hiding them behind results would misrepresent the intended production UX.

---

### ► Visual identity art strategy

###### 2026-06-22 (revised Phase 14.11)

---

###### Decision

`bg-motif.png` (raised fist, swirling arrows) appears in two contexts:

1. **Homepage hero** — full-bleed `::before` at 35% opacity behind the display text. This is the primary brand statement.
2. **Collection page headers** (Issues, Articles, Actions, Events) — right-anchored `<img>` at 25% opacity with a bottom fade (`mask-image: linear-gradient(to bottom, black 15%, transparent 75%)`), positioned absolutely behind the header text inside `.discoveryPageHeader`.

It does **not** appear on: search page, detail pages (article/action/event/topic), about page, submit pages, footer, nav, or any admin surface.

The footer carries no background artwork — a 2px amber `border-top` is the visual anchor. The nav wordmark is text-only ("FYF"). The favicon is a bold "F" lettermark SVG.

###### Rationale

- The homepage full-bleed usage establishes the motif as the brand's primary visual statement. Collection page headers reference it at reduced scale and opacity — the motif is ambient on discovery surfaces, absent when reading content.
- The collection page treatment was explored and validated in Phase 14.11. At 25% right-anchored with a bottom fade it reads as texture that supports the brand without competing with content. The same image on four pages at this opacity registers as visual consistency, not repetition.
- Detail pages are intentionally clean — the motif does not follow the user into content reading.
- Search is a utility surface; the motif adds noise there without adding identity.

###### Implications

- Do not add `bg-motif.png` to search, detail pages, about, submit, footer, or admin without revisiting this decision.
- The collection page implementation uses an `<img>` element (not a CSS `::before`) with `className="discoveryPageHeaderMotif"`. The CSS lives in `.discoveryPageHeader` in `pages.css`. Do not convert to a pseudo-element without verifying that the fade and z-index behavior transfers correctly.
- Do not add an SVG mark to the nav without first agreeing on a specific supplied graphic. Generating one from scratch is not an acceptable substitute.
- The favicon SVG (`fyf-mark.svg`) is the "F" lettermark. Replace if a brand mark is later supplied.

---

### ► Phase 14 review cycle: cutoff and what comes next

###### 2026-06-23

---

###### Decision

The agent-driven review cycle ends at Phase 14. No further agent-led visual review passes
are planned before launch. The cutoff score is approximately 7.5/10 — honest, not aspirational.
Professional UX review is the right next gate before Milestone 1 goes live.

###### Rationale

- Agent reviews across Phase 14 produced scores ranging from 7/10 (fresh cold session)
  to 8/10 (session with implementation context). The spread reflects the inconsistency of
  the method as much as real changes in product quality.
- Agents can identify structural gaps, missing navigation, dead code, and copy problems.
  They are not reliable for design judgment — whether something _feels right_, whether
  visual weight is correct, or whether a product reads as credible to a real user.
- Some Phase 14 improvements were meaningful (demo banner placement, journey strip,
  homepage card grid, 404 shell). Others were reorganization without clear net gain.
  The honest retrospective is that the review cycle surfaced some real problems and
  some noise, and it's not always clear which was which.
- Continuing to chase a higher agent score risks over-optimizing for what agents
  notice from screenshots rather than what real users experience.

###### Implications

- Do not commission further agent review passes as a quality gate before launch.
- The remaining open findings from the Phase 14 cycle are preserved in
  `docs/future/open-ux-findings.md`.
- A professional UX review — from a human who works in design — is the appropriate
  next quality gate before the public demo goes live.
- The events surface is the one area where agent reviews consistently identified
  real problems that were not fixed. That surface should be the first agenda item
  for the professional review.

---

### ► Hosting Platform: Railway for all Milestone 1 services

###### 2026-06-23

---

###### Decision

Railway hosts all three runtime services — Next.js web app, NestJS API, and PostgreSQL — in a single project. Vercel + Railway split was evaluated and rejected due to cross-origin cookie complexity with the existing cookie-backed admin auth implementation. AWS was evaluated and rejected as overkill for portfolio-scale traffic.

Full rationale, service topology, migration strategy, and admin auth boundary are documented in `docs/architecture/011-phase-15-deployment-architecture.md`.

---

### ► Observability strategy for Milestone 1

###### 2026-06-24

---

###### Decision

No paid APM, analytics, or log aggregation tool for Milestone 1. Observability is provided by:

1. **API request logs** — `HttpLoggingInterceptor` (globally registered in `apps/api/src/main.ts`) writes one line per request to stdout: `[Nest] ... [HTTP] METHOD /path STATUS Xms`. Railway captures stdout and makes it available in the per-service log viewer.
2. **API error logs** — NestJS's built-in exception filter writes unhandled errors to stderr. The bootstrap logger (`Logger('Bootstrap')`) logs startup success and fatal startup failures. All stderr goes to Railway logs.
3. **Web server logs** — Next.js writes server-side render errors and unhandled exceptions to stderr automatically. Railway captures the web service stderr stream.
4. **Railway platform logs** — Railway records deploy events, service restarts, and crash signals in the project activity feed, separate from application stdout/stderr.

###### Where to look when something breaks

| Symptom                             | Where to look                                        |
| ----------------------------------- | ---------------------------------------------------- |
| API returning 5xx or unexpected 4xx | Railway → API service → Logs (filter by status code) |
| API not starting / crashing on boot | Railway → API service → Logs (bootstrap error lines) |
| Public page rendering wrong / blank | Railway → Web service → Logs (Next.js stderr)        |
| Admin login failing                 | Railway → API service → Logs (auth guard rejections) |
| Service restart loop                | Railway → Project → Activity (deploy/crash events)   |

See `docs/runbooks/ops.md` for practical access steps.

###### Rationale

- Portfolio-scale traffic does not justify Datadog, Sentry, or similar paid tooling.
- Railway's built-in log streaming is sufficient to diagnose production incidents at this volume.
- Adding structured JSON logging or a log shipper would be appropriate if traffic grows or if the events crawler (Milestone 2) introduces background job failures that need alerting.

###### Implications

- Do not add `console.log` debug output in production paths — it adds noise to logs without a clear audience.
- Do not add a third-party APM or analytics SDK without revisiting this decision.
- If a production incident cannot be diagnosed from Railway logs, that is the signal to invest in more tooling, not to retrofit it speculatively.

---

## 2026-06-25 — CSP deferred; nonce-based approach required for Next.js

###### Decision

Content Security Policy (CSP) was not added during the Phase 15.6 web
infrastructure hygiene pass and is deferred to Milestone 2.

###### Rationale

Next.js RSC hydration injects inline `<script>` tags that require either
`'unsafe-inline'` in `script-src` (which defeats CSP for scripts entirely)
or a per-request nonce wired through middleware, `_document`, and every
script tag. The nonce approach is the correct one but is non-trivial to
implement without breaking the app. Getting it wrong causes silent failures
(blank pages, broken hydration) rather than graceful degradation.

The four headers already in place (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`) provide meaningful protection without
this complexity.

###### Implications

- Do not add a naive `Content-Security-Policy` header without implementing
  the nonce pattern — `'unsafe-inline'` in `script-src` provides no XSS
  protection and gives a false sense of security.
- When revisiting, use Next.js middleware to generate a per-request nonce and
  thread it through the RSC pipeline. See card 119 for context.
- Reference: `docs/runbooks/web-infrastructure-hygiene.md`

---
