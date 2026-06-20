# UI Swing Branch — Context

## What this branch does

Complete visual redesign pass. Every change is CSS/code — no raster image generation.

## Changes

### 1. Homepage hero: typographic poster replacing the PNG

The `hero.png` image block is gone. Replaced with a full typographic layout:

- Giant Playfair Display 900 weight question: **"Which one / is yours?"**
- A subline with the actual product promise: _"Pick one thing that bothers you. Read enough to get mad. Then do something about it."_
- All 7 issues rendered as oversized clickable text links in their accent colors, stacked vertically
- Each link has a colored left-border that reveals on hover + subtle right-indent animation
- Clicking any issue name takes you directly to that issue page — the journey starts immediately on the homepage

### 2. FYF wordmark: flame icon replaces CSS dots

The `· FYF ·` CSS-dot-flanked text is replaced with:

- A small flame SVG icon (brand gold) to the left of "FYF"
- The dots (::before/::after pseudo-elements) are removed
- Clean, intentional, scales correctly

### 3. Background motif: CSS grain replaces PNG

`bg-motif.png` references replaced with an inline SVG `feTurbulence` filter data URI:

- Covers the full viewport as a repeating 300px tile
- Opacity 3.5% with `mix-blend-mode: overlay` — adds paper/texture without imagery
- No image file required, no HTTP requests

### 4. Topic cards: 7 purpose-built SVG icons

`icons.tsx` gains 7 topic icons, all 24x24 with 2px stroke, hand-coded paths:

- Democracy → ballot box with slot
- Climate → sun over wave
- Civil Rights → raised open palm
- Consumer Activism → shopping cart with X
- Economic Justice → balance scale (one side heavier)
- Education → open book
- Local Community → grid of 4 houses

`TopicSummary` component now renders the matching icon above the topic name on collection variant, using `data-topic` slug as the lookup key.

### 5. Topic card tilt on hover

`.topicCollectionItemTilt` class added to the collection variant.
On hover: `translate(-3px, -4px) rotate(0.6deg)` — like picking up a physical card from a corkboard. 3 lines of CSS.

### 6. Copy pass

Homepage copy sharpened throughout. The journey section no longer repeats the hero premise.

## What to review

Run the dev server and check:

- `/` — does the hero feel like a poster? Do the issue links feel interactive?
- Hover each issue link — does the color/indent animation work?
- `/issues` — do topic cards have icons? Does the tilt work on hover?
- Header — does the flame + FYF mark look intentional?
- Any page — does the grain texture add warmth without noise?

## Files changed

- `apps/web/src/components/icons.tsx` — FlameIcon + 7 topic icons
- `apps/web/src/components/topic-summary.tsx` — icon wiring + tilt class
- `apps/web/src/app/(public)/layout.tsx` — wordmark swap
- `apps/web/src/app/(public)/page.tsx` — full hero rewrite
- `apps/web/src/app/globals.css` — poster hero, grain motif, icons, tilt, wordmark
