# Engineering Decisions Log

Record irreversible or high-impact decisions here.

---


### Decision Entry Template

---

### ► Title
###### YYYY-MM-DD

----

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

######  Decision
Topics are first‑class entities and visible user-facing pages.

######  Rationale
- Topics provide the primary organizational structure for the platform and support discovery.

######  Implications
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