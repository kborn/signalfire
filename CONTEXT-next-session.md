# Context for Next Agent Session

## State of the repo

**Branch:** `main`. Milestone 1 (through Phase 16) is merged and closed. No
active phase is in progress — post-Milestone-1, small changes land directly
on `main` without a formal phase entry.

**Uncommitted local changes** (site-mode admin-exposure + `/story` +
persistent-banner work, see below — explicitly not committed yet per user
instruction; do not commit without asking).

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
today. None of the work below is deployed yet.

---

## Your task this session: an independent review, then (if clean) a copy pass

This is a repeat of a review that already happened once. Read
`docs/agent-governance/decisions.md`, all entries dated 2026-07-26 and
2026-07-27 in order — the last one
("Independent review found a real gap; badge/dismiss approach replaced
with a permanent, sticky banner") is the important one; it explains what an
earlier review session found wrong (a real bug: the homepage kept a
hard-coded admin link that ignored the whole point of this effort) and what
changed as a result. Don't take that entry's own verification claims at
face value — re-derive them.

**Do this the way that entry's review was done, not by reading the diff
alone:**

1. Start `apps/api` (`pnpm api:dev`) and `apps/web` (`pnpm --filter web dev
-- -p 3000`) locally against real seeded Postgres data — check with
   `docker ps` first, Postgres is usually already running on 5432.
2. Actually load the pages — homepage, `/story`, `/issues`, `/articles`,
   `/actions`, `/events`, an article/action/event **detail** page, footer,
   mobile viewport — in both `NEXT_PUBLIC_SITE_MODE=portfolio` and
   `NEXT_PUBLIC_SITE_MODE=demo`. A scripted headless browser (Playwright,
   installed ad hoc via `npm install playwright && npx playwright install
chromium` in a scratch dir if not already available) beats guessing from
   markup.
3. If you change `NEXT_PUBLIC_SITE_MODE` between runs, delete
   `apps/web/.next` before restarting — Turbopack has cached a stale
   inlined value across restarts before and produced a false read.
4. Judge it as a visitor, not a code reviewer: did the stated goal
   (admin access not discoverable in `demo` mode; sample content clearly
   marked as fake) actually land, cleanly, without new UI/UX damage?
5. Free ports 3000/3001 when you're done so the user can run it themselves.

**Specifically worth re-checking, not just trusting the last entry's word
for it:**

- Is the homepage now clean of any admin-related content/links in both
  modes? (It should be — the section was deleted, not gated.)
- Does the banner (`apps/web/src/app/(public)/_components/demo-banner.tsx`)
  actually stay pinned in view when you scroll, including immediately
  after clicking from a scrolled-down list page into a detail page?
- Is `.site-demo-indicator` (the old "Demo" badge) actually gone
  everywhere — header, all four list pages? Grep for it; it should return
  nothing outside CSS history/decisions.md.
- Does `/story` read coherently top to bottom now, in both modes? (A
  heading was added mid-page and the hero paragraph was rewritten since
  the last full review — that's new territory, not yet independently
  checked by anyone other than the session that wrote it.)
- Footer "Contact" link and `/story`'s "email me" link — do both produce
  a sensible `mailto:` with a non-empty subject?
- `pnpm typecheck`, `pnpm lint`, `pnpm --filter web test` — all should
  pass (143 tests as of the last entry; confirm the count hasn't quietly
  dropped).

**If you find nothing wrong:** say so plainly, and then move to the actual
next task — `/story`'s two mode-branch paragraphs
(`apps/web/src/app/(public)/story/page.tsx`, both wrapped in
`{/* DRAFT — invented copy, edit freely. */}` comments) are still an
agent's invented copy, not the user's own words. The user wants to work
through a voice/content pass on that copy with you directly once the
functional review is clean. Don't rewrite it unprompted — wait for their
input.

**If you find something wrong:** report it the way the last review did —
plainly, with reasoning, without softening it because a prior session
already "fixed" this once. Fix it if the fix is small and you're confident;
otherwise describe it and ask.

---

## What changed, for orientation (see decisions.md for the full account)

- `NEXT_PUBLIC_SITE_MODE` (`portfolio` default | `demo`) in
  `apps/web/src/lib/site-mode.ts` — independent of the pre-existing
  `NEXT_PUBLIC_ENABLE_DEMO_MODE`, which controls whether the banner renders
  at all.
- **Rule now in force:** mode-dependent rendering
  (`isAdminExposed()`/`isDemoModeEnabled()` branches) is constrained to
  exactly two places — `/story` and the demo banner. Nowhere else should
  branch on either flag. If you find a third place, that's a bug.
- `/story` (`apps/web/src/app/(public)/story/page.tsx`) — mode-dependent
  "why this exists" content, admin credentials shown only in `portfolio`
  mode. `/about` is untouched, no mode dependency.
- The demo banner is now permanent (no Dismiss button, no
  `sessionStorage`) and lives inside `.site-sticky-area`, pinned under the
  header.
- The old "Demo" badge (`.site-demo-indicator`) and its per-page
  `.pageTitleRow` wrapper are fully removed.
- Footer has an unconditional "Contact" mailto link
  (`hello@findmyfight.com`, live via `forwardemail.net` MX records).

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
Web infrastructure: `docs/runbooks/web-infrastructure-hygiene.md`.
Milestone 2 planning: `docs/future/milestone-2-planning-notes.md`.
