# Context for Next Agent Session — Phase 14 Planning

## State of the repo

**Branch:** `main`
**Phase 13 is closed.** All local branch stacks have been squashed and merged. Main is clean:

```
4dedca7  feat: [Phase 13.5] Feature completion, UI identity, and mobile polish
db805d4  refactor(repo): [Phase 13.4 Repo & Launch Readiness]
62dcb36  feat(web): [Phase 13.3 Public Polish] Final UI polish
3c8d2d2  chore(release): [Phase 13.2 Demo Positioning]
6b30e65  feat(api): [Phase 13.1 Schema & Seed Hygiene]
```

`progress.md` still shows Phase 13 as ACTIVE — update it to ✅ and open Phase 14 before
beginning work.

---

## What Phase 14 is

Phase 14 is the portfolio credibility pass. The goal is to raise the product from the current
5.5 overall to a credible 8.0+ across Visual Design, UX/Product, and Engineering. The target
audience is a technical portfolio reviewer, not end users.

**The single most important constraint:** fix the product logic problems first. The reviewer
said: "Fix the product logic and the design improvements will compound. Fix only the design and
the product will still feel confused." Do not start visual polish before fixing UX structure.

---

## Fix list from the 2026-06-19 autonomous review

Scores: Visual Design 5.5 / UX 5.0 / Engineering 7.5 / Overall 5.5

### Critical (visible to any reviewer)

- **FIX-01** — Hero needs a visual anchor. The text-only hero with no image or texture
  undersells the brand. A first-time visitor has no idea what they're looking at for the first
  3 seconds. _(Visual Design)_
- **FIX-02** — Events page shows a random city by default. A user in Seattle landing on
  Philadelphia events will close the tab. Documented in decisions.md as acceptable for
  portfolio, but the review calls it confidence-destroying. Reconsider. _(UX)_
- **FIX-03** — "Take Action →" button on action detail has no trust scaffolding. No destination
  org, no context for what the user will find. For a civic action product this is the pivotal
  CTA. _(UX)_
- **FIX-04** — Admin workspace looks like a completely different product. Light background,
  dense tabular layout, gray badges. If a reviewer clicks "Admin Demo" — and they will — the
  jarring switch damages credibility. _(Visual Design)_

### High (engineering or product credibility)

- **FIX-05** — Homepage says "pick an issue" three times (hero, issue roll, journey steps).
  No arc, no momentum. _(UX)_
- **FIX-06** — Homepage issue roll is too plain. These are the primary navigation for the
  entire product and look like an unstyled `<ul>`. _(Visual Design)_
- **FIX-07** — Related Topics on action detail renders raw database description strings.
  "Climate: Issues related to climate change, environmental protection..." is schema copy,
  not UX copy. Replace with a short linked list. _(Engineering)_
- **FIX-08** — "FYF" with dots in the navbar is not a logotype. Either make it a real mark or
  use the full "Find Your Fight" name. The reviewer said the full name has force. _(Visual Design)_
- **FIX-09** — Action detail page buries the CTA. Order is: giant headline → subtitle →
  metadata (PUBLISHED, UPDATED) → "Take Action →" → description → related topics. The CTA
  should come before the metadata. _(UX)_

### Medium (polish)

- **FIX-10** — Admin Demo link in public nav is high-prominence amber in a product that isn't
  supposed to be a demo. _(UX)_
- **FIX-11** — Event type labels (RALLY, WORKSHOP) use an orange that doesn't appear anywhere
  else in the palette. _(Visual Design)_
- **FIX-12** — Issue cards on /issues index have database-description copy. _(UX)_
- **FIX-13** — No on-demand revalidation after admin mutations; content is stale for up to
  60s. _(Engineering)_
- **FIX-14** — Confirm /topics routes redirect to /issues or remove them. _(Engineering)_

---

## What was decided during Phase 13 that affects Phase 14

From `docs/agent-governance/decisions.md`:

- **Playfair Display + Inter**: locked. Do not change.
- **Dark navy (#101820) + amber (#cfac5a)**: locked.
- **/issues canonical public URL** (not /topics): locked.
- **Events default UX** (show events by default for portfolio, no geo): documented. May
  revisit in Phase 14 given review severity rating.
- **CSS split into 10 modules** in `apps/web/src/app/styles/`: locked architecture.
- **Demo banner** (not header pill) is the sole demo indicator: locked.
- **Login page** always shows full two-column layout: locked.

---

## How to structure Phase 14

**Collaboration model (important — read before planning):**

The Phase 13 approach of long autonomous sessions against a vague target failed. Phase 14 must
use small, scoped subphases. Each subphase should:

- Have a specific fix list drawn from the items above
- Have a clear done condition ("action detail CTA is above metadata")
- Be reviewable by the user before the next subphase starts

**Do not expand scope mid-subphase.** If you discover related issues, document them for the
next subphase rather than fixing them now.

**Suggested subphase breakdown:**

| Subphase | Scope                   | Fixes                  |
| -------- | ----------------------- | ---------------------- |
| 14.1     | Action detail page      | FIX-03, FIX-07, FIX-09 |
| 14.2     | Homepage restructure    | FIX-05, FIX-06         |
| 14.3     | Navbar and nav identity | FIX-08, FIX-10         |
| 14.4     | Hero visual anchor      | FIX-01                 |
| 14.5     | Admin visual alignment  | FIX-04                 |
| 14.6     | Engineering cleanup     | FIX-13, FIX-14         |
| 14.7     | Medium polish           | FIX-11, FIX-12         |
| 14.8     | Events UX decision      | FIX-02                 |

**Start with 14.1** — it has the most mechanical fixes (CTA order, DB copy removal) and
produces the clearest before/after for a reviewer.

---

## What the planning session should produce

Before writing any code, the Phase 14 planning session should:

1. Update `progress.md`: close Phase 13 (✅), open Phase 14 (🚧)
2. Confirm the subphase breakdown above with the user — adjust if needed
3. For each subphase, identify exactly which files will change and what the change is
4. Write the Phase 14 entry in `progress.md` with subphase tasks
5. Present the plan to the user for sign-off before any implementation begins

Do not start implementing during the planning session.

---

## Branch strategy for Phase 14

Each subphase gets its own branch off main:

```
main
  └── feat/phase_14/action-detail        (14.1)
  └── feat/phase_14/homepage             (14.2)
  └── feat/phase_14/nav-identity         (14.3)
  ...
```

Merge each subphase to main via PR after user review and CI passes. Do not stack branches
unless a subphase has a hard dependency on the previous one.

---

## What this session accomplished (for orientation, not to redo)

- Squashed the entire Phase 13 local branch stack (9 branches, 21 commits) into a single
  clean commit on main
- Merged as PR #71, then squashed with Phase 13.5 and 13.6 into one "Phase 13.5" commit
- Force-pushed clean history to main
- Fixed 3 test failures (homepage async suspense, issue step header assertions, action
  e2e `externalUrl` missing from expected payload)
