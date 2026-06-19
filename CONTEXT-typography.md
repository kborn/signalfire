# Typography Branch — Context for Next Agent

## What changed

- Replaced `Zilla_Slab` with `Playfair_Display` as the display font (`--font-display`)
- Kept `Inter` for body text (`--font-body`) — it was already there and correct
- Updated `--font-display` and `--font-body` CSS fallbacks in `:root` to match actual loaded fonts
- Increased hero heading weights to 800/900 (Playfair's strongest weights)
- Adjusted letter-spacing from -0.04em to -0.02em (Playfair has tighter internal spacing than Zilla Slab; the heavy negative spacing made it feel cramped)

## Why Playfair Display over Zilla Slab

- Playfair Display has a newspaper/civic editorial quality — appropriate for a civic action platform
- Zilla Slab is a Mozilla product font; it reads as "tech company trying to look editorial"
- At heavy weights (800/900), Playfair Display has a strong visual presence that matches the "FIND YOUR FIGHT" brand energy
- Better contrast between display and body (Playfair serif vs. Inter sans) than Zilla Slab (slab serif) vs. Inter

## What the FYF wordmark looks like now

The `.site-wordmark` uses `font-family: var(--font-display)` so it now renders in Playfair Display. The dots (::before/::after pseudoelements) remain. The wordmark should look more intentional now — Playfair's serifs give the abbreviated mark more personality.

## What to review

- Run the dev server and check the homepage hero heading — does "Choose an issue. Learn what is at stake. Take one real step." feel right in Playfair 800?
- Check the FYF wordmark in the header
- Check article body text readability (Inter should be clean)
- Check collection page headings (topic/article/action titles in the card grid)

## Files changed

- `apps/web/src/app/layout.tsx` — font import swap
- `apps/web/src/app/globals.css` — `:root` fallbacks + hero heading weights/spacing
