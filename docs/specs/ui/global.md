# UI Spec — Global Patterns

**Status:** DRAFT — awaiting user sign-off before implementation
**Last updated:** 2026-06-20

Individual page specs reference this document for shared patterns. Do not re-document these
in page specs — just reference them by name.

---

## Typography

| Role                    | Font             | Weight  | Notes                                |
| ----------------------- | ---------------- | ------- | ------------------------------------ |
| Display / hero headline | Playfair Display | 800–900 | Large, emotional moments only        |
| Section heading         | Playfair Display | 700     | h2-level section titles              |
| Card title              | Inter            | 600–700 | Readable at list density             |
| Body copy               | Inter            | 400     | All paragraph text                   |
| Meta label              | Inter            | 600     | Small-caps or uppercase, amber color |
| Breadcrumb / nav        | Inter            | 400–500 | Functional, not decorative           |

Admin pages use Inter bold for all headings — Playfair Display does not appear in admin.

---

## Color

| Token                              | Usage                                                         |
| ---------------------------------- | ------------------------------------------------------------- |
| `--color-brand-bg` / dark navy     | Page background everywhere                                    |
| `--color-brand-accent` / amber     | Primary CTAs, `metaLabel` text, structural accents            |
| `--color-text-primary` / off-white | All body and heading text                                     |
| `--color-text-muted`               | Secondary text, summaries, meta values                        |
| `--color-border-subtle`            | Section dividers, card borders                                |
| `--topic-color` (per-topic)        | Left border accent on issue cards and issue detail steps only |

Amber is a structural signal, not decoration. Use it for things that demand attention.
Do not use it for body copy or large background areas.

---

## Motif (`bg-motif.png`)

One asset, two uses:

- **Homepage hero:** scaled to fill section, opacity 35–40%, centered behind the display
  headline. Implemented as `::before` pseudo-element on the hero section. Scrolls with the page
  (not fixed). The fist should sit behind the headline text, not beside it.
- **Sitewide watermark:** fixed position, opacity 8–10%, bottom-right or full-bleed. Applied via
  `.motifPage::after` or equivalent. Not applied on the homepage section that already uses the
  hero treatment.

Admin pages: no motif. Login page right panel: motif at higher opacity (25–30%) with a dark
overlay (60–70% black) to ensure text readability.

---

## Cards (collection items)

Standard card = a clickable element with eyebrow, title, and optional summary.

**Interaction:**

- No underline at rest on any text
- On hover: title underlines only (`text-decoration: underline` on `.collectionItemTitle`)
- On hover: subtle translate (`transform: translateY(-2px)`) — no rotation
- Left border: topic accent color at reduced opacity at rest, full opacity on hover

```css
.collectionItem {
  text-decoration: none;
}
.collectionItem:hover .collectionItemTitle {
  text-decoration: underline;
}
.collectionItem:hover {
  transform: translateY(-2px);
}
```

**Do not** underline summary or eyebrow text on hover. That reads as unfinished.

---

## CTAs

| Variant        | Usage                   | Treatment             |
| -------------- | ----------------------- | --------------------- |
| `primaryCTA`   | One per section maximum | Amber fill, dark text |
| `secondaryCTA` | Supporting action       | Outline, amber border |
| `textCTA`      | Navigation-style links  | Underline, no box     |

One primary CTA per section. Do not put two primary CTAs side by side — use primary + secondary
or primary + textCTA.

---

## Section structure

Every page section follows this pattern:

1. Optional section label (small-caps, amber, e.g. "THE ISSUES")
2. Section heading (Playfair Display)
3. Optional supporting copy (Inter, body weight)
4. Content
5. Optional section-level CTA

Sections are separated by `border-bottom: 1px solid var(--color-border-subtle)` on the section
element. Do not add top borders — this creates double-line artifacts when sections stack.

---

## Breadcrumbs

- Format: `← [Topic name]` linking back to parent, or `← [Collection name]` if no parent topic
- Color: inherits topic accent color via `data-topic` attribute when a parent topic exists
- Position: above the page `<h1>`, outside the `detailHeader` section

---

## Interaction states

- **Hover:** translate only (no rotation), border intensification, title underline on cards
- **Focus:** visible focus ring — do not suppress for keyboard users
- **Active topic / selected filter:** `aria-current="true"`, accent color at full opacity

---

## Spacing

Uses CSS custom properties from the token system. Do not hardcode pixel values for spacing.
Section vertical padding: `var(--space-5)` top and bottom. Content gap: `var(--space-3)`.

---

## Mobile

- Container width: full width minus `var(--space-3)` padding on each side
- Cards: single column below the tablet breakpoint
- Hero display text: scale down to remain readable without overflowing
- Motif backdrop on hero: reduce opacity to 25% on mobile to reduce competition with text
- Touch targets: minimum 44px height on all interactive elements
