# UI Spec — Navbar & Nav Identity

**Status:** IMPLEMENTED — mark/favicon artwork deferred to Phase 14.10
**Last updated:** 2026-06-20
**Phase:** 14.3

---

## Goal

Replace the CSS-placeholder wordmark (`· FYF ·`) with an amber bolt/arrow mark + `FYF`
text, update the favicon to match, and remove Admin Demo from primary navigation entirely.

---

## Mark System

The nav mark and favicon are derived from the same element — an amber bolt/arrow icon
drawn from the motif vocabulary (the swirling arrows around the fist in `bg-motif.png`).
The favicon is a compact extraction of that same icon, not a separate design.

### Bolt/arrow icon (`FYFFistMark` or rename to `FYFMark`)

A simplified upward-pointing arrow/bolt SVG — think the swooping arrow elements from the
motif, reduced to a single clean shape at icon scale.

**Shape:** single amber arrow, angled upward-right. Not a literal ↑ — styled to echo the
motif's dynamic, sweeping arrow forms. Thick enough to read at 20px.

**Color:** `var(--color-brand-accent)` (amber), fill only, no stroke.

**Dimensions:** `viewBox="0 0 20 20"` or `0 0 24 24`. Rendered at `height: 20px` in the nav.

**Accessibility:** `aria-hidden="true"`, `focusable="false"`.

### Nav mark (header wordmark slot)

```
[Bolt icon 20px]  FYF
```

- Bolt icon left, `FYF` text right
- Gap: 8px
- `FYF` text: Inter, weight 700, `var(--color-text-primary)`, `letter-spacing: 0.1em`,
  font-size 15px
- Parent `<Link href="/" aria-label="Find Your Fight home">` — the SVG is decorative

### Favicon

Same bolt/arrow at 32×32 and 16×16, amber on dark navy background, exported as PNG.
Replaces `fyf-favicon.png`. No new design needed — extracted from the same SVG paths
as the nav mark, rendered with a filled dark navy background.

Implementation: generate the favicon PNG using a Node script that renders the SVG at the
needed sizes, or draw a minimal standalone version if the nav mark SVG doesn't export
cleanly at 16px.

---

## Nav Link Structure

### Primary nav (desktop)

Order left to right: **Issues · Articles · Actions · Events · Search icon · About**

No changes to the link set or order.

### Header actions (right side)

**Submit Content** — stays as pill CTA (`site-submit-link`), right-most item.

**Admin Demo** — **removed from header actions**. See Admin Demo section below.

### Mobile drawer

Same link order as desktop. Admin Demo removed from drawer. Submit Content stays.

---

## Admin Demo Relocation

Admin Demo is removed from `site-header-actions` and the mobile nav drawer. It moves
into the `DemoBanner` component, which is already demo-mode-only and visible just below
the header.

### DemoBanner change

Add an `Admin` link on the right side of the banner:

```
[ Demo — this site uses sample data. ]          [ Admin → ]
```

- Label: `Admin` (not `Admin Demo` — redundant in a demo banner)
- `href="/demo"` (unchanged)
- Styled as a small text link — not a pill, not amber bold. Muted, functional.
  Something like `color: var(--color-text-muted)` with underline on hover.
- Only rendered when `isDemoMode` is true (already handled by `DemoBanner`'s render condition)

### Rationale

A first-time visitor should not encounter `Admin Demo` alongside `Issues` and `Actions`.
`DemoBanner` is already the demo-context surface — it's the right place for the admin
entry point. A reviewer who sees the demo banner will look there for demo-related controls.

---

## Active Link State

No changes to existing behavior (`aria-current`, amber underline, bold weight).

---

## CSS changes

### layout.css

- `.site-brand-logo` — update height if the new SVG has a different intrinsic ratio
- No new class names needed unless an override is required for the new mark dimensions

### icons.tsx

- Replace `FYFLogo` SVG paths with the bolt/arrow mark
- Keep export name `FYFLogo` to avoid import churn (`layout.tsx` is the only caller)

### demo-banner.tsx / DemoBanner CSS

- Add `Admin` link to banner layout — minimal CSS addition, likely just flex row with
  space-between or a gap

---

## Done conditions

- [ ] Nav mark renders amber bolt/arrow icon + `FYF` text — no CSS-dot placeholder
- [ ] Mark is legible at rendered size on dark navy background
- [ ] Favicon (`fyf-favicon.png`) is updated to match the bolt/arrow mark
- [ ] Admin Demo does not appear in `site-header-actions` or the mobile drawer
- [ ] `DemoBanner` shows an `Admin` link when in demo mode
- [ ] Nav link order and active-link behavior are unchanged
- [ ] `pnpm typecheck` passes
