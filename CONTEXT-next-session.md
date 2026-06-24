# Context for Next Agent Session — Phase 15.6: Mobile Pass

## State of the repo

**Branch:** `feat/phase_15/mobile_pass` — already created, one commit ahead of main

**Current commit on branch:** fixes `force-cache` → `no-store` in
`apps/web/src/lib/api/base.ts:makePublicServerRequest` (renamed from
`makePublicBrowserRequest`). This fixes Next.js's persistent data cache
swallowing empty API responses after a deploy-before-seed scenario, and
ensures ISR revalidation actually hits the API on each render cycle.

**Main is clean** at the squash commit from Phase 15.5 (`7b599af`).

---

## Deployed environment

| Service         | URL                                    |
| --------------- | -------------------------------------- |
| Web (Next.js)   | `https://demo.findmyfight.com`         |
| API (NestJS)    | `https://api-demo-b566.up.railway.app` |
| DB (PostgreSQL) | Railway-managed, internal only         |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

**Demo seed:** Applied — topics, articles, actions, events, admin user all present.

**Pending Railway action:** Redeploy the `web` service to bust the stale
Next.js data cache so articles/actions/issues pages show seeded content.
Railway dashboard → `web` → Deployments → Redeploy.

---

## Phase 15.6 — Mobile Pass

The specific mobile issues need to be provided by the human at session start.
Ask for the issue list before doing anything else.

**When starting Phase 15.6:**

1. Ask the user for the specific mobile issues they found on the live site
2. Add them as explicit tasks in the Phase 15.6 section of `docs/agent-governance/progress.md`
3. Fix on `feat/phase_15/mobile_pass` branch, verify at mobile viewport, confirm no desktop regressions
4. The cache fix commit is already on this branch — the mobile fixes go on top of it

---

## Key decisions made this session (not yet in decisions.md)

- `force-cache` → `no-store` in public server fetches: ISR `revalidate` controls
  staleness at page level; `revalidatePath()` after admin mutations handles
  on-demand invalidation. `force-cache` was undermining both.
- GoDaddy: `demo.findmyfight.com` via CNAME → Railway web service;
  `findmyfight.com` via GoDaddy HTTP forwarding redirect → `demo.findmyfight.com`
- `SESSION_SECRET` does not exist in the codebase — sessions are DB-backed UUIDs
- `SEED_MODE` removed from Railway env vars — it's a CLI argument only
- Railway PostgreSQL disk: 5 GB is Railway minimum, no change made

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
