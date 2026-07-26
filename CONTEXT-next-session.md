# Context for Next Agent Session

## State of the repo

**Branch:** `main`. Milestone 1 (through Phase 16) is merged and closed. No
active phase is in progress — post-Milestone-1, small changes land directly
on `main` without a formal phase entry.

**Uncommitted local changes** (small site-mode admin-exposure change, see
below — awaiting user commit).

---

## Deployed environment

| Service         | URL                                    |
| --------------- | -------------------------------------- |
| Web (Next.js)   | `https://demo.findmyfight.com`         |
| API (NestJS)    | `https://api-demo-b566.up.railway.app` |
| DB (PostgreSQL) | Railway-managed, internal only         |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

There is no separate prod deployment. `demo.findmyfight.com` is the only
live instance.

---

## Recent/in-flight: site-mode admin exposure toggle

The user accepted a job offer (2026-07-26) and no longer needs this project
to actively support a job search. The site can now run as a general-audience
demo by default, with the option to flip back to a recruiter-facing posture
later. See `docs/agent-governance/decisions.md` (2026-07-26 entry) for full
rationale — this was a small, non-phase change, not a new milestone.

**What changed (uncommitted on `main`):**

| Change                                                      | File(s)                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| New `NEXT_PUBLIC_SITE_MODE` (`portfolio` default \| `demo`) | `apps/web/src/lib/site-mode.ts`                                          |
| Footer "Admin" link gated on `isAdminExposed()`             | `apps/web/src/app/(public)/layout.tsx`, `apps/web/src/app/not-found.tsx` |
| Demo banner Admin CTA/copy gated                            | `apps/web/src/app/(public)/_components/demo-banner.tsx`                  |
| `/demo` page admin-credentials section gated                | `apps/web/src/app/(public)/demo/page.tsx`                                |
| Env examples updated                                        | `apps/web/.env.local.example`, `apps/web/.env.local`                     |

**Not changed (deliberate):** `/admin/login` and the NestJS `AdminAuthGuard`
still work identically in both modes — this is a UI-discoverability toggle,
not an auth hard-block. The README's plaintext demo credentials are also
unaffected (static file, always public). Both are documented residual
exposures in decisions.md, not oversights.

**Still open:**

- [ ] Decide whether/when to set `NEXT_PUBLIC_SITE_MODE=demo` on the Railway
      `web` service for `demo.findmyfight.com` (dashboard-only, no code —
      there's no repo file enumerating deployed env vars for this service)
- [ ] Sweep for any other reviewer/recruiter-oriented framing (copy, README
      sections) that should also flex on career status — decisions.md flags
      this as future work, not yet scoped

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
Web infrastructure: `docs/runbooks/web-infrastructure-hygiene.md`.
Milestone 2 planning: `docs/future/milestone-2-planning-notes.md`.
