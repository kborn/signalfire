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

### ► Monorepo package manager is pnpm
###### 2026-03-07

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
