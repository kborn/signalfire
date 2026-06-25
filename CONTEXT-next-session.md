# Context for Next Agent Session — Phase 16: Public Launch

## State of the repo

**Branch:** `feat/phase_15/mobile_pass` — ready to merge. All commits are clean,
typecheck passes, tests pass.

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

## What's on this branch (Phase 15.6)

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
| robots.txt                                                   | `apps/web/src/app/robots.ts`                                              |
| sitemap.xml (dynamic, fetches from API)                      | `apps/web/src/app/sitemap.ts`                                             |
| Security headers                                             | `apps/web/next.config.ts`                                                 |
| Index cards 116–119 + CSP deferral decision                  | `docs/learnings/index-cards/`, `docs/agent-governance/decisions.md`       |

**One Railway dashboard action still needed:**
Add `https://demo.findmyfight.com` to the `WEB_ORIGINS` env var on the Railway
`api` service to fix CORS on public submissions. Dashboard-only, no code.

---

## Phase 16 — Public Launch

The active phase. See `docs/agent-governance/progress.md` for the definition
of done. Core tasks: verify the live deployment end-to-end, confirm the
reviewer journey works, declare Milestone 1 complete.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
Web infrastructure: `docs/runbooks/web-infrastructure-hygiene.md`.
Milestone 2 planning: `docs/future/milestone-2-planning-notes.md`.
