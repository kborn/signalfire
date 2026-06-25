# Context for Next Agent Session — Phase 16: Public Launch

## State of the repo

**Branch:** `feat/phase_15/mobile_pass` — ready to push/merge. All commits are clean.

**Main is clean** at the squash commit from Phase 15.5.

---

## Deployed environment

| Service         | URL                                    |
| --------------- | -------------------------------------- |
| Web (Next.js)   | `https://demo.findmyfight.com`         |
| API (NestJS)    | `https://api-demo-b566.up.railway.app` |
| DB (PostgreSQL) | Railway-managed, internal only         |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

**Demo seed:** Applied — topics, articles, actions, events, admin user all present.

---

## Phase 15.6 — What was fixed (this branch)

All fixes are CSS/JS only — no schema or API changes.

| Fix                                                          | File(s)                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Journey strip horizontal overflow on mobile                  | `responsive.css` — full-width 3-col tab grid                              |
| Homepage journey cards overflow                              | `responsive.css` — single column stack                                    |
| Homepage issue grid clipping                                 | `responsive.css` — icon+title row layout; `layout.css` — overflow-x: clip |
| Contribute link in mobile nav drawer (circle bug + no close) | `layout.css`, `submit-nav-link.tsx`, `site-nav.tsx`                       |
| Submission forms don't scroll to top on success              | `article-submission.tsx`, `event-submission.tsx`                          |
| Admin login doesn't redirect on mobile (cookie race)         | `LoginForm.tsx` — router.push → window.location.href                      |
| `screenshots_review/` tracked by git                         | `.prettierignore`                                                         |

**One Railway dashboard action still needed:**
Add `https://demo.findmyfight.com` to the `WEB_ORIGINS` env var on the Railway `api` service to fix CORS on public submissions. This is a dashboard-only change, no code.

---

## Phase 16 — Public Launch

The next phase is Phase 16 — Public Launch. See `docs/agent-governance/progress.md` for
the definition of done. The core tasks are verifying the live deployment, confirming the
reviewer journey works end-to-end, and declaring Milestone 1 complete.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
Milestone 2 planning: `docs/future/milestone-2-planning-notes.md`.
