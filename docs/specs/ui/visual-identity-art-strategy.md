# Visual Identity Art Strategy

**Status:** Active — governs all art asset decisions for Milestone 1  
**Last updated:** 2026-06-22  
**Related decision:** `decisions.md → Visual identity art strategy`

---

## Decisions (summary)

| Question                | Decision                                         |
| ----------------------- | ------------------------------------------------ |
| Motif on homepage       | Yes — atmospheric hero background                |
| Motif on interior pages | No                                               |
| Motif in footer         | No                                               |
| Nav wordmark            | Text-only ("FYF") — no SVG mark                  |
| Favicon                 | Bold "F" lettermark, built from brand typography |
| Footer artwork          | None — color system only                         |

---

## Art inventory

### `bg-motif.png` — the illustration

**What it is:** A raised fist surrounded by circular swirling arrows. High-energy civic action imagery. Amber, rust, and dark navy palette.

**Where it is used:** Homepage hero section only (`heroPoster::before`).

**Where it must not appear:** Interior pages, footer, search page, collection pages, detail pages, admin.

**Current problem:** The exported PNG has a noise/grain layer baked in ("crackle"), producing a textured dark background instead of transparency. Arrowhead edges are muddy from compression or an unflattened blending mode.

**Required replacement spec:**

- Format: PNG-24 with alpha transparency (no background color, no noise layer)
- Export size: minimum 2400px wide at 1× scale (the image is displayed up to ~1120px container width at `background-size: 110% auto`, so 2× = ~2464px; round up to 2500px for safety)
- All shapes must have clean, sharp edges — no anti-aliasing halos, no JPEG-style compression artifacts
- Remove all noise/grain/texture overlays from the source file before export
- Arrowheads must be fully opaque with defined borders against the transparent background
- The dark area in the current file behind the illustration is the noise layer — the alpha channel should be the only "background"
- Deliver as: `apps/web/public/bg-motif.png` (replace in place)

**How it is displayed on the homepage:**

```css
.heroPoster::before {
  background-image: url('/bg-motif.png');
  background-size: 110% auto;
  background-position: center center;
  opacity: 0.3–0.35; /* tune after delivery */
}
```

---

### Favicon — the "F" lettermark

**What it is:** A bold "F" in Playfair Display style on a dark navy rounded square. References the brand typography. Readable at 16×16px.

**Why not FYF text or the fist:** FYF text at 16px is illegible. The fist reads as political imagery in a browser tab. A single "F" is clean, distinctive, and ties directly to the brand typeface.

**Current state:** `fyf-favicon.png` (existing file — rejected by reviewer for CSS dots and weak lettermark) and `fyf-mark.svg` (current session — broken chevron, needs reverting). Neither is correct.

**Required delivery spec:**

- Format: **SVG** (primary) — supported by all modern browsers, renders perfectly at all sizes
- Fallback: PNG at 32×32 and 64×64 for older browsers (optional for Milestone 1)
- Dimensions: SVG `viewBox="0 0 32 32"`
- Content: Bold "F" character in a Playfair Display-style serif, amber (`#cfac5a`) on dark navy (`#0f1923`) background
- Background: rounded square (`rx="5"` or `rx="6"`)
- The "F" should fill roughly 55-65% of the square height, centered
- No dots, no decoration, no additional letters

**Implementation:** The SVG favicon lives at `apps/web/public/fyf-mark.svg`. It is referenced in `apps/web/src/app/layout.tsx` (root metadata). Confirm the `<link rel="icon">` points to this file.

**Who builds it:** Can be constructed in code (SVG with embedded text or path) — does not require the user to supply art. Agent should build it using SVG `<text>` with a web-safe serif fallback, or trace the "F" glyph from Playfair Display as a path.

---

### Nav wordmark — text only

**What it is:** The "FYF" text in the header, rendered by `site-wordmark-text`, is the wordmark. There is no separate SVG mark to the left of it.

**Decision:** Remove `FYFLogo` from the nav entirely. The mark caused three consecutive failed attempts (placeholder circle → broken chevron → wrong symbol approach). The text wordmark is sufficient and consistent with brands that use text-only marks (e.g. major publication wordmarks).

**Required change:**

- Remove `<FYFLogo className="site-brand-logo" />` from `apps/web/src/app/(public)/layout.tsx`
- Remove or mark `FYFLogo` as deprecated in `apps/web/src/components/icons.tsx`
- Remove `.site-brand-logo` CSS rule from `layout.css` if it becomes unused
- The `site-wordmark` link and `site-wordmark-text` span remain unchanged

---

### Footer — no artwork

**Decision:** The footer uses no background image. The visual anchor is the `border-top` line, replaced with a 2px amber (`var(--color-brand-primary)`) rule.

**Required change:**

- Remove `site-footer::before` pseudo-element from `layout.css`
- Change `border-top: 1px solid var(--color-border-subtle)` to `border-top: 2px solid var(--color-brand-primary)` on `.site-footer`

---

## Usage map

| Asset                  | Homepage         | About   | Interior pages | Footer   | Admin    |
| ---------------------- | ---------------- | ------- | -------------- | -------- | -------- |
| `bg-motif.png`         | ✅ Hero only     | ⚠️ Open | ❌ Never       | ❌ Done  | ❌ Never |
| `fist.png`             | —                | ⚠️ Open | ❌ Never       | ❌ Never | ❌ Never |
| Favicon `fyf-mark.svg` | Browser tab only | —       | —              | —        | —        |
| FYFLogo SVG mark       | ❌ Done          | —       | —              | —        | —        |
| "FYF" text wordmark    | ✅ Nav           | ✅ Nav  | ✅ Nav         | —        | —        |

**⚠️ About page art is an open decision.** Options: nothing, `fist.png`, or `bg-motif.png` (current,
but the full composition is too complex at the ~280px sidebar width it renders at). Resolve before
closing Phase 14.10. See `CONTEXT-next-session.md` for full framing.

---

## Implementation order

When the cleaned `bg-motif.png` is not yet delivered, implement in this order:

1. **Do now (no art needed):**
   - Remove `FYFLogo` from nav, clean up `.site-brand-logo`
   - Replace footer `::before` motif with amber border-top
   - Build and ship "F" lettermark favicon SVG
   - Revert `fyf-mark.svg` to the new favicon (not the broken chevron)

2. **After cleaned `bg-motif.png` is delivered:**
   - Replace `apps/web/public/bg-motif.png` in place
   - Tune hero `opacity` (start at 0.30, adjust visually)
   - Remove motif from `about-hero::before` if still present
   - Verify homepage hero renders without crackle

3. **After both above are done:**
   - Run full visual check: homepage, about, one collection page, search (empty state), footer
   - Confirm no remaining `bg-motif.png` references outside homepage

---

## What the user needs to supply

| Item                   | Format                    | Dimensions    | Notes                                 |
| ---------------------- | ------------------------- | ------------- | ------------------------------------- |
| Cleaned `bg-motif.png` | PNG-24, transparent alpha | ≥ 2400px wide | No noise layer, clean arrowhead edges |

That is the only external art dependency. Everything else (favicon SVG, nav wordmark cleanup, footer) is implementable in code.
