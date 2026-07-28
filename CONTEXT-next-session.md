# Context for Next Agent Session

## State of the repo

**Branch:** `site-mode-story-banner`, tracking `main`. Everything described
below is committed and pushed — working tree is clean, nothing local-only.
Open as **PR #98** (`Retire /demo, restore /story, make demo banner permanent
and sticky`), not yet merged.

Milestone 1 (through Phase 16) is merged and closed. No active phase is in
progress — post-Milestone-1, small changes land directly via PR without a
formal phase entry.

---

## Deployed environment

| Service         | URL                                    |
| --------------- | -------------------------------------- |
| Web (Next.js)   | `https://demo.findmyfight.com`         |
| API (NestJS)    | `https://api-demo-b566.up.railway.app` |
| DB (PostgreSQL) | Railway-managed, internal only         |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

There is no separate prod deployment. `demo.findmyfight.com` is the only
live instance. `NEXT_PUBLIC_SITE_MODE` is **not yet set** on the Railway
`web` service; it defaults to `portfolio`, so admin is still exposed live
today. None of PR #98's work is deployed yet — it only takes effect once
merged and released.

---

## What PR #98 did, end to end

See `docs/agent-governance/decisions.md` — all entries from
`Post-Milestone: NEXT_PUBLIC_SITE_MODE gates admin exposure by career status`
(2026-07-26) through `Demo banner dismiss restored; sample-content flags
added; /story copy finalized with the user` (2026-07-28, the newest entry on
this topic) — for the full account, including two internal reversals
(`/demo` → folded into `/about` → split back out as `/story`; banner
dismiss removed → restored). Read the newest entry on a topic first;
`decisions.md` is append-only history, not always current-state truth on its
own — check `###### Superseded` notes.

Current shipped state, in brief:

- `NEXT_PUBLIC_SITE_MODE` (`portfolio` default | `demo`) in
  `apps/web/src/lib/site-mode.ts` gates admin discoverability, independent of
  `NEXT_PUBLIC_ENABLE_DEMO_MODE` (whether the sample-data banner renders at
  all).
- **Rule in force:** mode-dependent rendering
  (`isAdminExposed()`/`isDemoModeEnabled()` branches) is constrained to
  exactly `/story` and the demo banner. Nowhere else should branch on either
  flag — if you find a third place, that's a bug.
- `/story` (`apps/web/src/app/(public)/story/page.tsx`) holds "why this
  instance exists" content, admin credentials shown only in `portfolio`
  mode. `/about` is untouched and has no mode dependency. `/story`'s copy is
  **finalized** — written together with the user, no DRAFT markers remain.
  Don't treat it as a placeholder to rewrite unprompted.
- The demo banner (`demo-banner.tsx`) is dismissible again (sessionStorage),
  redesigned with the close control paired against the eyebrow, and lives
  inside `.site-sticky-area` so it can't scroll out of view while shown.
- Article/action/event detail pages each carry an unconditional "randomly
  generated, not real" line under the headline (`.sampleContentFlag`) —
  independent of site mode, since the seeded content is fake either way.
- Footer has an unconditional "Story" link (nav + footer, both modes) and an
  unconditional "Contact" mailto (`hello@findmyfight.com`, live via
  `forwardemail.net` MX records).
- Test coverage: `pnpm typecheck` / `pnpm lint` / `pnpm --filter web test`
  all pass, 149 tests. New coverage this round: `story/page.test.tsx`,
  sample-content-flag assertions on the three detail-page tests, and
  `apps/web/src/app/not-found.test.tsx` (the root 404 — distinct from
  `apps/web/src/app/(public)/not-found.test.tsx`, which this PR doesn't
  touch).

---

## Still open

- **Merge PR #98.** Content and functional review are both done (an
  independent review session plus a direct copy pass with the user); nothing
  is blocking merge that's known of right now.
- **Decide when to set `NEXT_PUBLIC_SITE_MODE=demo`** on the Railway `web`
  service for `demo.findmyfight.com` (dashboard-only, no code change — no
  repo file enumerates deployed env vars for this service).
- **Sweep for other reviewer/recruiter-oriented framing** (copy, README
  sections) that should also flex on career status — flagged as future work
  in the original 2026-07-26 entry, not yet scoped.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
Web infrastructure: `docs/runbooks/web-infrastructure-hygiene.md`.
Milestone 2 planning: `docs/future/milestone-2-planning-notes.md`.
