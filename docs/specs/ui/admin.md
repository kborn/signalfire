# UI Spec — Admin Visual Alignment

**Status:** DRAFT — awaiting user sign-off before implementation
**Last updated:** 2026-06-20
**Phase:** 14.5

---

## Goal

The admin workspace and login page should read as the same product as the public site,
in a different operational mode — not a different company. Two things break that today:
(1) white panel cards inside a dark shell create a jarring light-mode island inside a
dark-mode product; (2) Playfair Display headings in admin context feel editorial when
the workspace should feel functional.

This spec covers five targeted changes. No structural layout changes. No new components.

---

## 1. Admin panel background — white → dark surface

### What

`.adminPanel` and its related white-background elements currently use `#ffffff` / `#171717`
(light mode). They should use the same dark surface token system as the rest of the admin
shell.

### Current state

```css
.adminPanel {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #171717;
}
.adminPanelHeader h2,
.adminPanelHeader h3 {
  color: #171717;
}
```

Other affected light-mode classes:

- `.adminLongTextPreview`: `background: #f9fafb`, `border: 1px solid #e5e7eb`
- `.adminTextEditor`, `.adminTextareaEditor`: `background: #ffffff`, `color: #171717`
- `.adminTable th/td`: `border-bottom: 1px solid #e5e7eb`
- `.adminTable tbody tr:hover td`: `background: #fafafa`
- `.adminTableSummaryCell`: `background: linear-gradient(to bottom, rgba(248, 250, 252, 0.9), ...)`
- `.adminBadge`: `background: #f3f4f6`, `color: #444444`, `border: 1px solid #d1d5db`
- `.adminReviewBanner` / `.adminReviewBannerError`: hardcoded green/red light theme
- `.adminDek`: `color: #425466`
- `.adminStat`: `color: #171717`
- `.adminDefinitionList dt`: `color: #6b7280`
- `.adminDefinitionList dd`, `.submissionLabel`: `color: #171717`
- `.adminTableLink`, `.adminTableRecordLink`: `color: #171717`
- `.adminEmptyStateTitle`: `color: #171717`
- `.adminCreatedRecord*`, `.adminCreatedRecordLink`: various `#171717` / `#6b7280` / `#e5e7eb`

### Change

Replace all admin-specific hardcoded light-mode hex values with dark-theme token equivalents.
The editor form overrides (`.actionEditorForm .adminPanel`, etc.) already do this correctly
for editor panels — apply the same approach globally.

**Target mappings:**

| Light value                      | Dark replacement                                                                 | Notes                          |
| -------------------------------- | -------------------------------------------------------------------------------- | ------------------------------ |
| `#ffffff` (background)           | `color-mix(in srgb, var(--color-surface-soft) 88%, var(--color-page-bg) 12%)`    | Matches editor panel treatment |
| `#171717` (text)                 | `var(--color-text-primary)`                                                      |                                |
| `#425466` / `#6b7280`            | `var(--color-text-muted)`                                                        |                                |
| `#444444`                        | `color-mix(in srgb, var(--color-text-primary) 72%, var(--color-text-muted) 28%)` |                                |
| `#e5e7eb` / `#d1d5db` (borders)  | `var(--color-border-subtle)`                                                     |                                |
| `#fafafa` / `#f9fafb` (hover/bg) | `color-mix(in srgb, var(--color-surface-soft) 55%, var(--color-page-bg) 45%)`    |                                |
| `#f3f4f6` (badge bg)             | `color-mix(in srgb, var(--color-surface-soft) 72%, var(--color-page-bg) 28%)`    |                                |

**Review banners** — replace hardcoded success/error palette with dark-theme variants:

```css
/* Success banner */
.adminReviewBanner {
  border-color: color-mix(in srgb, #4ade80 28%, var(--color-border-subtle));
  background: color-mix(in srgb, #4ade80 8%, var(--color-surface-soft));
  color: var(--color-text-primary);
}
.adminReviewBannerText {
  color: var(--color-text-muted);
}

/* Error banner */
.adminReviewBannerError {
  border-color: color-mix(in srgb, var(--color-status-error) 38%, var(--color-border-subtle));
  background: color-mix(in srgb, var(--color-status-error) 8%, var(--color-surface-soft));
  color: var(--color-text-primary);
}
.adminReviewBannerError .adminReviewBannerText {
  color: color-mix(in srgb, var(--color-status-error) 72%, var(--color-text-muted));
}
```

**Segmented controls and filter groups** — additionally, the default button background
mixes white in, producing an unintentionally light surface on a dark theme:

```css
/* Current — 45% white makes buttons visibly lighter than surrounding surface */
.adminSegmentedControl a,
.adminSegmentedControl button,
.adminFilterGroup a,
.adminFilterGroup button {
  background: color-mix(in srgb, var(--color-surface-soft) 55%, #ffffff 45%);
}
```

Replace `#ffffff` with `var(--color-page-bg)` so the mix produces a mid-surface dark
tone rather than a light one:

```css
.adminSegmentedControl a,
.adminSegmentedControl button,
.adminFilterGroup a,
.adminFilterGroup button {
  border-color: var(--color-border-subtle);
  background: color-mix(in srgb, var(--color-surface-soft) 55%, var(--color-page-bg) 45%);
}
```

The active state (using `var(--color-brand-primary)`) is already token-correct — no change.

**Note:** Pagination and topic selector components also live in `admin.css` but are used
on public collection pages. Their light active-state treatment (`white 86%` mix) reads as
intentional high-contrast signal on the dark public surface. Do not change those classes.

**Scope:** `apps/web/src/app/styles/admin.css` — no JSX changes required.

---

## 2. Admin headings — Playfair Display → Inter bold

### What

Admin `h1`, `h2`, `h3` headings should render in Inter (bold), not Playfair Display.
The global type system applies Playfair Display to all headings by default; admin
needs an explicit `font-family` override on its heading selectors.

### Current state

`.adminHeader h1` has `font-size`, `line-height`, `letter-spacing` but no `font-family`
override → inherits Playfair Display from the global `h1` rule.

Same issue on `.adminSection h2/h3`, `.adminPanelHeader h2/h3`, `.adminLoginFormTitle`.

### Change

Add `font-family: var(--font-body)` to every admin heading selector that currently
lacks it. Tighten `letter-spacing` to `-0.01em` (Playfair's negative spacing is too
tight for Inter at large sizes; Inter at display scale wants a slightly negative but
less extreme value).

```css
/* In admin.css — add to existing selectors */
.adminHeader h1 {
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.adminSection h2,
.adminSection h3 {
  font-family: var(--font-body);
  font-weight: 700;
}

.adminPanelHeader h2,
.adminPanelHeader h3 {
  font-family: var(--font-body);
  font-weight: 700;
}
```

```css
/* In responsive.css — add to existing .adminLoginFormTitle */
.adminLoginFormTitle {
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: -0.03em; /* Inter needs less negative spacing than Playfair at display scale */
}
```

**Do not** add font overrides to the editor form panels — those already inherit correctly
through the `color-scheme: dark` override and Inter is the body font.

**Scope:** `apps/web/src/app/styles/admin.css`, `apps/web/src/app/styles/responsive.css`

---

## 3. No decorative elements in admin workspace

### What

Admin workspace should have no motif watermark, no hero textures, no background imagery.
Functional register only.

### Current state

The `.adminShell` already uses a clean dark gradient with no imagery. The login page
right panel (`adminLoginBrandPanel`) uses `bg-motif.png` as a background, which is
intentional and in scope for the login overlay treatment (see section 4).

### Change

**None needed.** The workspace is already clean. Verify that no future admin page
accidentally inherits `.publicShell::after` or any motif watermark that may be added
in later phases. The `.adminShell` scoping already prevents public watermark rules
from leaking in.

---

## 4. Login page left panel — flat → branded surface

### What

The left form panel (`.adminLoginFormPanel`) is nearly opaque dark navy with no brand
vocabulary — no amber, no texture, no structural accent. The right panel has an amber
radial glow, amber kicker text, and glass-morphism elements. They use the same dark color
family but feel like different design systems.

The fix: give the left panel the same amber radial language as the right panel, centered at
the top. One shared visual element is enough to make them read as siblings.

### Current state

```css
.adminLoginFormPanel {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(14, 24, 36, 0.96);
  border: 1px solid rgba(174, 184, 197, 0.16);
}
```

The white gradient is effectively invisible at 5% opacity. The border is a flat blue-gray
with no brand connection.

### Change

Replace the white gradient with a subtle amber radial glow at the top. Replace the generic
border with an amber-tinted variant that echoes the right panel's palette.

```css
.adminLoginFormPanel {
  background:
    radial-gradient(ellipse at top center, rgba(207, 172, 90, 0.07), transparent 55%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-surface-soft) 72%, var(--color-page-bg) 28%),
      rgba(14, 24, 36, 0.98)
    );
  border-color: color-mix(in srgb, var(--color-brand-primary) 28%, rgba(174, 184, 197, 0.16));
}
```

The amber radial is 7% opacity — barely visible, but it creates the same "warm top, cool
bottom" feeling as the right panel. The gradient uses token system values instead of raw hex.
The border gains a faint amber warmth without calling attention to itself.

**Scope:** `apps/web/src/app/styles/responsive.css` — `.adminLoginFormPanel` block.

---

## 5. Login page right panel — overlay and grain treatment

### What

The right panel (`adminLoginBrandPanel`) uses `bg-motif.png` as a background image
with a dark overlay. The current overlay includes two gradient layers:

- `linear-gradient(135deg, rgba(8,15,24,0.74), rgba(20,31,46,0.56))` — directional
- `radial-gradient(circle at top left, rgba(212,177,88,0.18), transparent 34%)` — amber tint

The overlay is not uniformly dark enough at the lighter end (`0.56` at the bottom-right
corner). The spec calls for 60–70% dark overlay coverage and a grain CSS treatment to
add tactile texture.

### Change

**Overlay:** Replace the directional overlay with a flat 65% dark layer plus the
existing amber radial tint. This ensures text readability across the full panel.

**Grain:** Add a CSS grain texture using a pseudo-element with SVG noise, overlaid at
low opacity. This adds tactile depth without a real image asset.

```css
.adminLoginBrandPanel {
  background:
    linear-gradient(180deg, rgba(8, 15, 24, 0.66), rgba(8, 15, 24, 0.66)),
    radial-gradient(circle at top left, rgba(212, 177, 88, 0.18), transparent 34%),
    url('/bg-motif.png');
  background-size: cover;
  background-position: center;
  position: relative; /* needed for ::after pseudo-element */
  overflow: hidden; /* clip the pseudo-element */
}

.adminLoginBrandPanel::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 192px 192px;
  background-repeat: repeat;
  opacity: 0.035;
  pointer-events: none;
}
```

The grain pseudo-element sits on top of the background imagery but behind the panel
content (z-index not needed — default stacking keeps it below children).

**Scope:** `apps/web/src/app/styles/responsive.css` — `.adminLoginBrandPanel` block.

---

## Done conditions

- [ ] Admin panels (`adminPanel`) render with dark surface background — no white cards in the workspace
- [ ] All admin-specific hardcoded light hex values (`#ffffff`, `#171717`, `#e5e7eb`, etc.) are replaced with dark token equivalents
- [ ] Segmented control and filter group default buttons render as dark surface, not light — `#ffffff` mix replaced with `var(--color-page-bg)`
- [ ] Review banners (success/error) read clearly on dark surface
- [ ] Admin `h1`, `h2`, `h3` headings render in Inter bold — Playfair Display does not appear in the admin workspace
- [ ] Login page `h1` ("Sign in") renders in Inter bold
- [ ] Login left panel has a visible amber radial glow at the top — it reads as the same brand as the right panel
- [ ] Login right panel overlay is uniformly dark enough for text readability (≥65% dark coverage)
- [ ] Login right panel has visible grain texture at low opacity
- [ ] Editor form panels are unchanged — they already use the correct dark treatment
- [ ] No motif watermark or decorative imagery appears in the admin workspace (verify only)
- [ ] `pnpm typecheck` passes clean
- [ ] No JSX/component changes — CSS only
