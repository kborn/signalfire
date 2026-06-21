# UI Spec — Continuity Checklist

**Status:** ACTIVE — reference for all Phase 14.7 continuity review
**Last updated:** 2026-06-20

Use this checklist before approving any public-facing page. It defines what visual and
copy continuity means for Find Your Fight — not just that a review happened, but what
specifically to look for.

---

## Visual Direction (from `global.md`)

### Typography

- [ ] Display/hero text uses Playfair Display 800–900 at display scale (`clamp` values, not fixed px)
- [ ] Section headings use Playfair Display 700
- [ ] Body copy is Inter 400
- [ ] Meta labels are Inter 600, small-caps or uppercase, amber color
- [ ] No Playfair Display in admin workspace (Inter bold only)

### Color

- [ ] Page background is dark navy — no light surfaces on public pages
- [ ] Primary CTAs and structural accents use amber (`--color-brand-accent`)
- [ ] Body text is off-white (`--color-text-primary`)
- [ ] Secondary text uses `--color-text-muted` — not hardcoded hex
- [ ] Topic accent colors (`--topic-accent`) only on issue cards, breadcrumbs, and step headers
- [ ] No amber used for large background areas or body copy

### Motif (`bg-motif.png`)

- [ ] Homepage hero: motif at 35% opacity via `::before`, scrolls with page
- [ ] Interior page detail headers (`detailHero`): motif at ~10% opacity, right-anchored
- [ ] Discovery page headers (`discoveryPageHeader`): motif at ~8% opacity, right-anchored
- [ ] Footer: motif at 18% opacity via `::before`, centered
- [ ] Admin workspace: no motif anywhere except login page right panel (25–30% with overlay)
- [ ] No fixed/watermark motif at the page level (that approach was abandoned — see `decisions.md`)

### Cards / Collection Items

- [ ] No text underlines at rest
- [ ] On hover: title underlines only, not summary or eyebrow
- [ ] On hover: `translateY(-2px)` only — no rotation
- [ ] Left border: topic accent at ~40% opacity at rest, full on hover

### CTAs

- [ ] One `primaryCTA` per section maximum
- [ ] No two `primaryCTA` buttons side by side
- [ ] `primaryCTA`: amber fill, dark text
- [ ] `secondaryCTA`: outline, amber border
- [ ] `textCTA`: underline, no box

### Spacing

- [ ] Section vertical padding: `var(--space-5)` top and bottom
- [ ] No hardcoded pixel spacing values outside tokens
- [ ] Sections separated by `border-bottom`, not `border-top` (prevents double-line artifacts)

---

## Motif Opacity Quick Reference

| Location                             | Opacity | Implementation                   |
| ------------------------------------ | ------- | -------------------------------- |
| Homepage hero (`heroPoster::before`) | 35%     | `background-size: 110% auto`     |
| Interior detail header (detailHero)  | 10%     | `::before`, right-anchored       |
| Discovery page header                | 8%      | `::before`, right-anchored       |
| Footer (`site-footer::before`)       | 18%     | centered, `min(400px, 56%) auto` |
| Login page right panel               | 25–30%  | with 65% dark overlay            |

---

## Copy Voice

- [ ] Reads as direct, serious, and human — not product-description or UI chrome
- [ ] The emotional build is present: overwhelm → collective power → personal fire → action
- [ ] "Find Your Fight" dual meaning is present where appropriate: the issue that's yours AND
      the determination within you to act on it
- [ ] No passive hedging ("submissions are reviewed before...")
- [ ] No self-explanation ("this page shows you...")
- [ ] No trendy fragment copy ("Find. Act. Fight.")
- [ ] All public strings sound like they came from the same voice

### "Find Your Fight" presence points

These pages/moments should carry the FYF dual meaning in some form:

| Page / section            | Current state                               | Should thread FYF dual meaning? |
| ------------------------- | ------------------------------------------- | ------------------------------- |
| Homepage hero             | Manifesto copy — "That fire already exists" | ✅ already present              |
| About page hero           | "The name means two things..." (explicit)   | ✅ already present              |
| Action detail CTA area    | "Take Action on [domain] →"                 | ✅ section label added          |
| Issue detail step headers | "Read" / "Act" with sub text                | ✅ step 03 sub updated          |

---

## Page-by-Page Checklist

### Homepage (`/`)

- [ ] Hero has Playfair Display at display scale
- [ ] Motif is visible at 35% behind the hero display text
- [ ] Issue roll carries per-topic accent colors at rest (via `heroPosterIssueLink[data-topic]`)
- [ ] Journey steps use card pattern (translate hover, title-only underline)
- [ ] No motif appears again below the hero (footer ornament only)

### Issues index (`/issues`)

- [ ] `discoveryPageHeader` has motif at ~8% opacity, right-anchored
- [ ] h1 "Issues" is at display scale
- [ ] Topic cards show topic accent colors on left border

### Issue detail (`/issues/[slug]`)

- [ ] `detailHero` has motif at ~10% opacity, right-anchored
- [ ] h1 is at display scale (Playfair Display 800)
- [ ] Breadcrumb carries topic accent color
- [ ] Step numbers (02, 03) are at display scale in Playfair Display
- [ ] Step 03 sub copy threads FYF meaning

### Articles index (`/articles`)

- [ ] `discoveryPageHeader` has motif at ~8% opacity, right-anchored
- [ ] h1 "Articles" is at display scale

### Article detail (`/articles/[slug]`)

- [ ] `detailHero` has motif at ~10% opacity, right-anchored
- [ ] h1 title is at display scale
- [ ] Breadcrumb carries topic accent color

### Actions index (`/actions`)

- [ ] `discoveryPageHeader` has motif at ~8% opacity, right-anchored
- [ ] h1 "Actions" is at display scale

### Action detail (`/actions/[slug]`)

- [ ] `detailHero` has motif at ~10% opacity, right-anchored
- [ ] h1 title is at display scale
- [ ] CTA area has FYF-threaded section label
- [ ] Breadcrumb carries topic accent color

### Events (`/events`, `/events/[id]`)

- [ ] Events page has clear default state (upcoming events visible, filters narrow from there)
- [ ] Bounded demo geography is labeled
- [ ] Event detail `detailHero` has motif treatment

### About (`/about`)

- [ ] FYF dual meaning is explicit ("The name means two things…")
- [ ] About steps use card pattern
- [ ] No repeated large hero art beyond the hero section

### Submit (`/submit`, `/submit/article`, `/submit/event`)

- [ ] Submit landing copy is inviting, not defensive about moderation
- [ ] Success state tells submitters what happens next

---

## Admin Workspace Continuity

- [ ] Dark navy background throughout — no light surfaces
- [ ] All headings use Inter bold (not Playfair Display)
- [ ] Admin table rows are fully clickable (stretched-link pattern) — consistent across all list pages
- [ ] Amber used for CTAs and status signals only
- [ ] No motif watermark in admin workspace (login page right panel only)
- [ ] Focus rings visible on all interactive elements
- [ ] Login page reads as the same product as the public site

---

## Accessibility

- [ ] Focus rings visible on all interactive elements (keyboard navigation)
- [ ] `aria-current` on active nav links and active filters
- [ ] Form validation errors are announced (ARIA live regions or associated error elements)
- [ ] Touch targets are at least 44px height on all interactive elements
- [ ] Tab order is logical through submission form, events filter, and moderation workflow

---

## Screenshots (require dev server + seeded DB)

Run: `pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`

- [ ] Screenshot 01: homepage (hero + issue roll visible)
- [ ] Screenshot 02: issues index
- [ ] Screenshot 03: issue detail (steps visible)
- [ ] Screenshot 04: admin dashboard / submissions queue
- [ ] Screenshot 05: admin submission detail

Screenshots live in `docs/screenshots/`. README gallery links to these 5 captures.
