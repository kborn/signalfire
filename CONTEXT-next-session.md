# Context for Next Agent Session — Phase 14 Implementation

## State of the repo

**Branch:** `main`
**Phase 14 is planned and ready to implement.** All subphases (14.1–14.9) are written in
`docs/agent-governance/progress.md` with specific tasks and done conditions.

**Start with Phase 14.1 — Action Detail Page.**

---

## Design decisions locked in this session

Read these before touching any UI. They are not up for re-evaluation.

### Visual identity

- **Dark navy + amber stays.** Applied more boldly — less timid, more force.
- **Motif (`bg-motif.png`):** one asset, two uses. Homepage hero: scaled up, 30–40% opacity behind
  live text. All other pages: watermark at 8–10% opacity. Skip or fade the watermark on the
  homepage itself to avoid the same image at two opacities on one page.
- **Hero:** retire `hero.png`. Use `bg-motif.png` scaled up as the hero backdrop. The current
  hero.png is typography treated as an image — it does not function as a background.
- **Nav mark:** replace `· FYF ·` with a simplified SVG fist mark derived from `bg-motif.png`.
  CSS dots are a placeholder, not a logotype.
- **Admin Demo link:** remove amber styling. Treat as a secondary nav item, not a featured CTA.

### Admin design

- Same dark navy palette as the public site — not the same decorative language.
- Inter bold for admin headings (not Playfair Display).
- No motif watermark, no hero textures in admin — functional register only.
- Amber retained for CTAs and status signals.
- Login page right panel: darken overlay to 60–70%; apply grain CSS treatment. Structure is correct,
  do not change it.

### Topic accent colors

- Keep on `/issues` index cards and issue detail step headers — they serve navigation.
- Thread to entity pages via **breadcrumb only** (start minimal, iterate if it feels incomplete).
  Pass `data-topic={topics[0]?.slug}` to the breadcrumb element; style via existing CSS.
- Do NOT thread colors across the full page or into body content — not a rainbow.

### Bold palette (three specific changes, no more)

- `metaLabel` text color → amber
- Collection item left borders visible at rest (reduced opacity), full on hover (currently hover-only)
- Issue detail step numbers (`02`, `03`) → display scale Playfair Display

### Copy voice

The register is punk rock and sincere. An emotional plea, not a product description. Sentences
that build, not bullet points that summarize.

The dual meaning of "Find Your Fight" is the emotional underpinning:

1. Find the issue that is yours to fight for
2. Find the fighter that lives within you

The arc: acknowledge the overwhelm → acknowledge the feeling that one person can't change anything
→ pivot to collective power and individual responsibility → summon the fire within → Find Your Fight.

**Avoid:** trendy fragment copy, passive hedging, self-explanation, defensive moderation language,
copy that justifies the product to the user.

---

## Subphase summary

| Subphase | Scope                 | Key work                                                                |
| -------- | --------------------- | ----------------------------------------------------------------------- |
| 14.1     | Action detail         | CTA order, trust scaffolding, Related Topics copy                       |
| 14.2     | Homepage + hero       | Arc, motif-as-hero, manifesto copy                                      |
| 14.3     | Navbar                | SVG fist mark, Admin Demo prominence                                    |
| 14.4     | Issues + entity pages | Breadcrumb threading, issue card copy, bold palette                     |
| 14.5     | Admin alignment       | Dark navy admin, Inter headings, login panel                            |
| 14.6     | Engineering           | `revalidatePath()`, type consolidation, TopicService, topic color model |
| 14.7     | Continuity pass       | Visual + copy coherence across all pages                                |
| 14.8     | Events UX             | Default city behavior decision                                          |
| 14.9     | Copy pass             | Full copy audit against voice direction above                           |

Full task lists and done conditions are in `progress.md` Phase 14.

---

## Starting with 14.1 — Action Detail Page

**Branch:** `feat/phase_14/action-detail`

**Files to change:**

- `apps/web/src/app/(public)/actions/[slug]/page.tsx` — reorder sections, add domain extraction,
  replace TopicSummary with a simple linked list

**Specific changes:**

1. **CTA order** — move `ctaGroup` div above `detailMetaGroup`. New order:
   headline → summary (detailLead) → CTA → metadata → description → related articles

2. **Trust scaffolding** — when `externalUrl` exists, extract the hostname and render:
   `Take Action on [domain] →` (e.g. "Take Action on moveon.org →"). Use `new URL(action.externalUrl).hostname`.
   Strip `www.` prefix. When `externalUrl` is null, render nothing (existing behavior, verify it holds).

3. **Related Topics** — replace the `TopicSummary` component usage with a plain linked list:
   topic name as a link to `/issues/[slug]`. No description text. No component — just an `<ul>`
   with `<li><Link>` items.

**Done condition:** CTA appears before metadata; domain is visible in the CTA label;
Related Topics shows names only as links.

---

## Branch strategy

Each subphase gets its own branch off main:

```
main
  └── feat/phase_14/action-detail     (14.1)
  └── feat/phase_14/homepage          (14.2)
  └── feat/phase_14/nav-identity      (14.3)
  └── feat/phase_14/entity-pages      (14.4)
  └── feat/phase_14/admin-alignment   (14.5)
  └── feat/phase_14/engineering       (14.6)
  └── feat/phase_14/continuity        (14.7)
  └── feat/phase_14/events-ux         (14.8)
  └── feat/phase_14/copy-pass         (14.9)
```

User reviews each subphase before the next begins. Do not stack branches.

---

## Guardrails for Phase 14

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — if you find something related, document it in progress.md
  and continue
- Do not re-open design decisions listed above — they are settled
- The copy voice direction above is the brief for any copy written in any subphase
